import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import type { AgentThreadTableSchema } from "~/database/schema/AgentThreadTableSchema";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { agentThreadFetchFx } from "~/user-agent/fx/agentThreadFetchFx";
import type { AgentThreadPatchSchema } from "~/user-agent/schema/AgentThreadPatchSchema";
import type { AgentThreadWhereSchema } from "~/user-agent/schema/AgentThreadWhereSchema";

export namespace agentThreadPatchFx {
	export interface Props extends AgentThreadPatchSchema.Type {
		scope: AgentThreadWhereSchema.Type;
	}
}

export const agentThreadPatchFx = Effect.fn("agentThreadPatchFx")(function* ({
	patch,
	query,
	scope,
}: agentThreadPatchFx.Props) {
	const logger = yield* getLoggerFx("agentThreadPatchFx");
	logger.trace("agentThreadPatchFx", {
		patch,
		query,
		scope,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateService = yield* DateServiceFx;
			const thread = yield* agentThreadFetchFx({
				...query,
				scope,
			});
			const updatedAt = dateService.now().toJSDate();

			return yield* dbFx(async (kysely) => {
				return kysely
					.updateTable("agent_thread")
					.set({
						...patch,
						updatedAt,
					})
					.where("id", "=", thread.id)
					.returningAll()
					.executeTakeFirstOrThrow() satisfies Promise<AgentThreadTableSchema.Type>;
			});
		}),
	);
});

export type agentThreadPatchFx = ReturnType<typeof agentThreadPatchFx>;
