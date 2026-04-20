import { createMiddleware } from "@tanstack/react-start";
import { Effect } from "effect";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { agentThreadCollectionFx } from "~/user/agent/server/fx/agentThreadCollectionFx";
import { agentThreadCreateFx } from "~/user/agent/server/fx/agentThreadCreateFx";

export const withRunnerThreadMiddleware = createMiddleware()
	.middleware([
		withUserMiddleware,
		withDatabaseMiddleware,
	])
	.server(async ({ next, context: { database, rootLogger, user } }) => {
		const threadId = await Effect.gen(function* () {
			{
				const [thread] = yield* agentThreadCollectionFx({
					scope: {
						userId: user.id,
					},
					where: {
						archivedAt: "active",
					},
					sort: [
						{
							field: "updatedAt",
							order: "desc",
						},
					],
					cursor: {
						page: 0,
						size: 1,
					},
					limit: 1,
				});

				if (thread) {
					return thread.id;
				}
			}

			{
				const thread = yield* agentThreadCreateFx({
					userId: user.id,
				});

				return thread.id;
			}
		}).pipe(withKyselyFx(database), withDateFx, withLoggerFx(rootLogger), Effect.runPromise);

		return next({
			context: {
				threadId,
			},
		});
	});
