import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { agentStreamCollectionFx } from "~/user/agent/server/fx/agentStreamCollectionFx";
import { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";
import { AgentStreamSchema } from "~/user/agent/server/schema/AgentStreamSchema";

export namespace agentStreamItemsFn {
	export type Error = Effect.Effect.Error<agentStreamCollectionFx>;
}

export const agentStreamItemsFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(AgentStreamQuerySchema)
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
