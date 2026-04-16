import { createMiddleware } from "@tanstack/react-start";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { KyselySession } from "~/user/agent/server/session/KyselySession";

export const withRunnerSessionMiddleware = createMiddleware()
	.middleware([
		withUserMiddleware,
		withDatabaseMiddleware,
	])
	.server(
		async ({
			next,
			context: {
				database: { kysely },
				user,
			},
		}) => {
			return next({
				context: {
					session: new KyselySession({
						kysely,
						userId: user.id,
						threadId: user.id,
					}),
				},
			});
		},
	);
