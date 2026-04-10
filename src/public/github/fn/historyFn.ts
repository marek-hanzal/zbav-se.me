import { createServerFn } from "@tanstack/react-start";
import { DateTime } from "luxon";
import { z } from "zod";
import { genId } from "@/lib/common/gen-id";
import type { GitHubHistorySchema } from "~/public/github/server/schema/GitHubHistorySchema";
import { ServerGithubSchema } from "~/server/env/ServerGithubSchema";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";

const Repo = {
	owner: "marek-hanzal",
	name: "zbav-se.me",
} as const;

const InputSchema = z
	.looseObject({
		weeks: z.coerce.number().int().nonnegative().min(1).max(104).meta({
			description: "How many weeks back (including the current week) to return",
			example: 12,
		}),
	})
	.strip()
	.meta({
		id: "GitHubHistoryQuery",
		description: "Query parameters for GitHub history",
	});

export const historyFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.inputValidator(InputSchema)
	.handler(
		async ({
			data,
			context: {
				database: { kysely },
			},
		}) => {
			const historyDays = data.weeks * 7;

			// We return "last N days (including today)", so derive everything from the same range.
			const startUtc = DateTime.utc()
				.startOf("day")
				.minus({
					days: historyDays - 1,
				});

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

			const githubConfig = ServerGithubSchema.parse(process.env);

			for (;;) {
				const res = await fetch("https://api.github.com/graphql", {
					method: "POST",
					headers: {
						Accept: "application/vnd.github+json",
						Authorization: `Bearer ${githubConfig.SERVER_GITHUB}`,
						"X-GitHub-Api-Version": "2022-11-28",
						"User-Agent": "zbav-se.me",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query,
						variables: {
							...Repo,
							since: startUtc.toISO(),
							after,
						},
					}),
				});

				if (!res.ok) {
					throw new Error(`GitHub GraphQL request failed (${res.status})`);
				}

				const json = (await res.json()) as any;

				if (Array.isArray(json?.errors) && json.errors.length > 0) {
					throw new Error(
						`GitHub GraphQL error: ${String(json.errors[0]?.message ?? "Unknown")}`,
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

				const existing = await kysely
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

				if (missing.length > 0) {
					// Insert only missing.
					// If you have sha as primary key, this keeps data clean.
					await kysely
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
				}

				if (!pageInfo?.hasNextPage) {
					break;
				}

				after = typeof pageInfo.endCursor === "string" ? pageInfo.endCursor : null;
				if (!after) {
					break;
				}
			}

			// Return cached history aggregated into UTC days (last N weeks).
			const commits = await kysely
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
				if (!dt?.isValid) {
					continue;
				}
				const key = toYmd(dt);
				countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
			}

			const days: GitHubHistorySchema.Type[] = [];
			for (let i = 0; i < historyDays; i++) {
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

			return days;
		},
	);
