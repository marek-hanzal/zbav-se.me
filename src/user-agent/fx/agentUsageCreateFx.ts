import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { agentThreadPatchFx } from "~/user-agent/fx/agentThreadPatchFx";
import type { AgentUsageCreateSchema } from "~/user-agent/schema/AgentUsageCreateSchema";

export namespace agentUsageCreateFx {
	export interface Props extends AgentUsageCreateSchema.Type {
		userId: string;
	}
}

export const agentUsageCreateFx = Effect.fn("agentUsageCreateFx")(function* ({
	userId,
	threadId,
	requests,
	input,
	total,
	output,
}: agentUsageCreateFx.Props) {
	const logger = yield* getLoggerFx("agentUsageCreateFx");
	logger.trace("agentUsageCreateFx", {
		userId,
		threadId,
		requests,
		input,
		total,
		output,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateService = yield* DateServiceFx;

			/**
			 * Bump thread (no input needed).
			 */
			yield* agentThreadPatchFx({
				query: {
					where: {
						id: threadId,
					},
				},
				patch: {},
				scope: {
					userId,
				},
			});

			return yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("agent_usage")
					.values({
						id: genIdFn(),
						userId,
						threadId,
						requests,
						input,
						total,
						output,
						createdAt: dateService.nowFn().toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});
		}),
	);
});

export type agentUsageCreateFx = ReturnType<typeof agentUsageCreateFx>;
