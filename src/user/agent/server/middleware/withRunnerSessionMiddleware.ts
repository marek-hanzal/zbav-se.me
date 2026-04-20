import { createMiddleware } from "@tanstack/react-start";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { withRunnerThreadMiddleware } from "~/user/agent/server/middleware/withRunnerThreadMiddleware";
import { KyselySession } from "~/user/agent/server/session/KyselySession";

export const withRunnerSessionMiddleware = createMiddleware()
	.middleware([
		withUserMiddleware,
		withDatabaseMiddleware,
		withRunnerThreadMiddleware,
	])
	.server(
		async ({
			next,
			context: {
				database: { kysely },
				threadId,
				user,
			},
		}) => {
			return next({
				context: {
					session: new KyselySession({
						kysely,
						userId: user.id,
						threadId,
					}),
				},
			});
		},
	);
