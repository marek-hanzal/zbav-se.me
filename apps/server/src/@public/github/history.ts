import { createRoute, z } from "@hono/zod-openapi";
import { genId } from "@use-pico/common/gen-id";
import { DateTime } from "luxon";
import { AppEnv } from "~/AppEnv";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { GitHubHistorySchema } from "./schema/GitHubHistorySchema";

const REPO = "marek-hanzal/zbav-se.me";
// Keep this as "weeks" so the UI grid never ends on a partial week.
// Half-year ~= 26 weeks.
const HISTORY_WEEKS = 12;
const HISTORY_DAYS = HISTORY_WEEKS * 7;

const parseRepo = (repo: string) => {
	const [owner, name] = repo.split("/");
	return {
		owner,
		name,
	};
};

export const withHistoryApi: Routes.Fn = ({ publicHono }) => {
	publicHono.openapi(
		createRoute({
			method: "get",
			path: "/github/history",
			description: `Syncs commit history into local cache and returns daily commit counts for the last ${HISTORY_WEEKS} weeks.`,
			operationId: "apiGithubHistory",
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(GitHubHistorySchema),
						},
					},
					description: "GitHub commit history (cached)",
				},
				500: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Failed to sync/fetch history from GitHub",
				},
			},
			tags: [
				"github",
				"public",
			],
		}),
		async (c) => {
			try {
				// Adjust this line to your actual DB injection.
				const db = c.var.database;

				const { owner, name } = parseRepo(REPO);

				// We return "last N days (including today)", so derive everything from the same range.
				const endUtc = DateTime.utc().startOf("day");
				const startUtc = endUtc.minus({
					days: HISTORY_DAYS - 1,
				});
				const sinceIso = startUtc.toISO() ?? startUtc.toJSDate().toISOString();

				const query = `
					query RepoHistorySince($owner: String!, $name: String!, $since: GitTimestamp!, $after: String) {
						repository(owner: $owner, name: $name) {
							defaultBranchRef {
								target {
									... on Commit {
										history(since: $since, first: 100, after: $after) {
											pageInfo { hasNextPage endCursor }
											nodes {
												oid
												committedDate
												message
											}
										}
									}
								}
							}
						}
					}
				`;

				let after: string | null = null;

				for (;;) {
					const res = await fetch("https://api.github.com/graphql", {
						method: "POST",
						headers: {
							Accept: "application/vnd.github+json",
							Authorization: `Bearer ${AppEnv.SERVER_GITHUB}`,
							"X-GitHub-Api-Version": "2022-11-28",
							"User-Agent": "zbav-se.me",
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							query,
							variables: {
								owner,
								name,
								since: sinceIso,
								after,
							},
						}),
					});

					if (!res.ok) {
						return c.json<NoticeSchema.Type, 500>(
							{
								type: "error",
								message: `GitHub GraphQL request failed (${res.status})`,
							},
							500,
						);
					}

					const json = (await res.json()) as any;

					if (Array.isArray(json?.errors) && json.errors.length > 0) {
						return c.json<NoticeSchema.Type, 500>(
							{
								type: "error",
								message: `GitHub GraphQL error: ${String(json.errors[0]?.message ?? "Unknown")}`,
							},
							500,
						);
					}

					const history = json?.data?.repository?.defaultBranchRef?.target?.history;
					const nodes: any[] = Array.isArray(history?.nodes) ? history.nodes : [];
					const pageInfo = history?.pageInfo;

					// Normalize page commits (keep only valid ones).
					const pageCommits = nodes
						.filter(
							(n) =>
								typeof n?.oid === "string" &&
								typeof n?.committedDate === "string" &&
								typeof n?.message === "string",
						)
						.map((n) => ({
							sha: n.oid as string,
							date: n.committedDate as string,
							message: n.message as string,
						}));

					if (pageCommits.length === 0) {
						break;
					}

					// Fetch existing SHAs for this page in one DB roundtrip.
					const shas = pageCommits.map((x) => x.sha);

					const existing = await db
						.selectFrom("github")
						.select([
							"sha",
						])
						.where("sha", "in", shas)
						.execute();

					const existingSet = new Set(existing.map((r: any) => r.sha));

					const missing = pageCommits.filter((x) => !existingSet.has(x.sha));

					// If there is nothing new in this page, we can stop early (newest -> oldest order).
					if (missing.length === 0) {
						break;
					}

					// Insert only missing.
					// If you have sha as primary key, this keeps data clean.
					await db
						.insertInto("github")
						.values(
							missing.map((x) => ({
								id: genId(),
								sha: x.sha,
								date: new Date(x.date),
								message: x.message,
							})),
						)
						.execute();

					if (!pageInfo?.hasNextPage) {
						break;
					}

					after = typeof pageInfo.endCursor === "string" ? pageInfo.endCursor : null;
					if (!after) {
						break;
					}
				}

				// Return cached history aggregated into UTC days (last N weeks).
				const commits = await db
					.selectFrom("github")
					.select([
						"date",
					])
					.where("date", ">=", startUtc.toJSDate())
					.execute();

				const toUtcDateTime = (value: unknown) => {
					if (value instanceof Date) {
						return DateTime.fromJSDate(value).toUTC();
					}

					if (typeof value === "string") {
						const hasZone = /[zZ]$|[+-]\d\d:\d\d$/.test(value);

						// ISO-like formats
						if (value.includes("T")) {
							const dt = hasZone
								? DateTime.fromISO(value, {
										setZone: true,
									})
								: DateTime.fromISO(value, {
										zone: "utc",
									});
							if (dt.isValid) {
								return dt.toUTC();
							}
						}

						// SQL timestamp without timezone (common for Postgres `timestamp`)
						const sql = DateTime.fromSQL(value, {
							zone: "utc",
						});
						if (sql.isValid) {
							return sql.toUTC();
						}

						// Date-only string
						const dateOnly = DateTime.fromISO(value, {
							zone: "utc",
						});
						if (dateOnly.isValid) {
							return dateOnly.startOf("day");
						}
					}

					return null;
				};

				const countsByDay = new Map<string, number>();
				const toYmd = (dt: DateTime) => dt.toUTC().toFormat("yyyy-MM-dd");
				for (const row of commits) {
					const dt = toUtcDateTime(row.date);
					if (!dt || !dt.isValid) {
						continue;
					}
					const key = toYmd(dt); // UTC YYYY-MM-DD
					countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
				}

				const days: GitHubHistorySchema.Type[] = [];
				for (let i = 0; i < HISTORY_DAYS; i++) {
					const key = toYmd(
						startUtc.plus({
							days: i,
						}),
					);
					days.push({
						date: key,
						count: countsByDay.get(key) ?? 0,
					});
				}

				return c.json(days, 200);
			} catch (e) {
				console.error(e);
				return c.json<NoticeSchema.Type, 500>(
					{
						type: "error",
						message: "Failed to sync/fetch GitHub history",
					},
					500,
				);
			}
		},
	);
};
