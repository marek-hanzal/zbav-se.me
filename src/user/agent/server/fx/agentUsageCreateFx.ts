import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { AgentUsageTableSchema } from "~/server/database/@table/AgentUsageTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { agentThreadPatchFx } from "~/user/agent/server/fx/agentThreadPatchFx";
import type { AgentUsageCreateSchema } from "~/user/agent/server/schema/AgentUsageCreateSchema";

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
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

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

			return yield* tryDbFx(
				async () =>
					kysely
						.insertInto("agent_usage")
						.values({
							id: genId(),
							userId,
							threadId,
							requests,
							input,
							total,
							output,
							createdAt: dateContext.now().toJSDate(),
						})
						.returningAll()
						.executeTakeFirstOrThrow() satisfies Promise<AgentUsageTableSchema.Type>,
			);
		}),
	);
});

export type agentUsageCreateFx = ReturnType<typeof agentUsageCreateFx>;
