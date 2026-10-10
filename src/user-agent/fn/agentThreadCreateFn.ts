import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { agentThreadCreateFx } from "~/user-agent/fx/agentThreadCreateFx";
import { AgentThreadCreateSchema } from "~/user-agent/schema/AgentThreadCreateSchema";
import { AgentThreadSchema } from "~/user-agent/schema/AgentThreadSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace agentThreadCreateFn {
	export type Error = Effect.Error<agentThreadCreateFx>;
}

export const agentThreadCreateFn = createServerFn({
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
			dataFx: agentThreadCreateFx({
				userId: user.id,
			}),
		}).pipe(
			withKyselyFn(database),
			withDateServiceFn(),
			withLoggerFn(rootLogger),
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
