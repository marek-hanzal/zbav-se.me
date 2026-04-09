import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { agentStreamCollectionFx } from "~/user/agent/server/fx/agentStreamCollectionFx";
import { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";
import { AgentStreamSchema } from "~/user/agent/server/schema/AgentStreamSchema";

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
			withCatchFx({
				ZodErrorFx({ zod, input }) {
					logger.error("ZodError", {
						zod,
						input,
					});
					throw new Error("ZodError");
				},
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
