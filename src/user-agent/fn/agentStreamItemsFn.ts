import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { agentStreamCollectionFx } from "~/user-agent/fx/agentStreamCollectionFx";
import { AgentStreamQuerySchema } from "~/user-agent/schema/AgentStreamQuerySchema";
import { AgentStreamSchema } from "~/user-agent/schema/AgentStreamSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace agentStreamItemsFn {
	export type Error = Effect.Error<agentStreamCollectionFx>;
}

export const agentStreamItemsFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(AgentStreamQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(AgentStreamSchema),
			dataFx: agentStreamCollectionFx({
				...data,
				scope: {
					userId: user.id,
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withLoggerFx(rootLogger),
			Effect.tapError((error) => {
				return Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				});
			}),
			Effect.map((items) => {
				/**
				 * Because TSS is quite strict about serializable output, we've to lift payload type back to Record
				 */
				return items.map(({ payload }) => payload as Record<string, any>);
			}),
			Effect.runPromise,
		);
	});
