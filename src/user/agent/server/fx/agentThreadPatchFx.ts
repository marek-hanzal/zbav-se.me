import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import type { AgentThreadTableSchema } from "~/server/database/@table/AgentThreadTableSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { agentThreadFetchFx } from "~/user/agent/server/fx/agentThreadFetchFx";
import type { AgentThreadFilterSchema } from "~/user/agent/server/schema/AgentThreadFilterSchema";
import type { AgentThreadPatchSchema } from "~/user/agent/server/schema/AgentThreadPatchSchema";

export namespace agentThreadPatchFx {
	export interface Props extends AgentThreadPatchSchema.Type {
		scope: AgentThreadFilterSchema.Type;
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
			const dateContext = yield* DateContextFx;
			const thread = yield* agentThreadFetchFx({
				...query,
				scope,
			});
			const updatedAt = dateContext.now().toJSDate();

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
