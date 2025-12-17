import { createRoute, z } from "@hono/zod-openapi";
import { genId } from "@use-pico/common/gen-id";
import { AppEnv } from "~/AppEnv";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { GitHubHistorySchema } from "./schema/GitHubHistorySchema";

const REPO = "marek-hanzal/zbav-se.me";
const DEFAULT_LIMIT = 20;

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
			description:
				"Syncs commit history from the last year into local cache and returns recent cached history.",
			operationId: "apiGithubHistoryYear",
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

				const since = new Date();
				since.setFullYear(since.getFullYear() - 1);

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
								since: since.toISOString(),
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

				// Return cached recent history from DB
				const recent = await db
					.selectFrom("github")
					.select([
						"sha",
						"date",
						"message",
					])
					.orderBy("date", "desc")
					.execute();

				return c.json(recent satisfies GitHubHistorySchema.Type[], 200);
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
