import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { agentThreadCreateSessionFx } from "~/user/agent/server/fx/agentThreadCreateSessionFx";
import { AgentThreadCreateSchema } from "~/user/agent/server/schema/AgentThreadCreateSchema";
import { AgentThreadSchema } from "~/user/agent/server/schema/AgentThreadSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace agentThreadCreateSessionFn {
	export type Error = Effect.Error<agentThreadCreateSessionFx>;
}

export const agentThreadCreateSessionFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(AgentThreadCreateSchema)
	.handler(async ({ context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name);

		return zodGuardFx({
			schema: AgentThreadSchema,
			dataFx: agentThreadCreateSessionFx({
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateServiceFx(),
			withLoggerFx(rootLogger),
			Effect.tapError((error) => {
				return Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				});
			}),
			Effect.runPromise,
		);
	});
