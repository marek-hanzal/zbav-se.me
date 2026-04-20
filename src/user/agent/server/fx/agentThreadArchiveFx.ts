import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { agentThreadFetchFx } from "~/user/agent/server/fx/agentThreadFetchFx";
import type { AgentThreadFilterSchema } from "~/user/agent/server/schema/AgentThreadFilterSchema";
import type { AgentThreadQuerySchema } from "~/user/agent/server/schema/AgentThreadQuerySchema";

export namespace agentThreadArchiveFx {
	export interface Props extends Omit<AgentThreadQuerySchema.Type, "cursor" | "sort"> {
		scope: AgentThreadFilterSchema.Type;
	}
}

export const agentThreadArchiveFx = Effect.fn("agentThreadArchiveFx")(function* (
	query: agentThreadArchiveFx.Props,
) {
	const logger = yield* getLoggerFx("agentThreadArchiveFx");
	logger.trace("agentThreadArchiveFx", {
		...query,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;
			const thread = yield* agentThreadFetchFx(query);
			const archivedAt = dateContext.now().toJSDate();

			yield* tryDbFx(async () =>
				kysely
					.updateTable("agent_thread")
					.set({
						archivedAt,
						updatedAt: archivedAt,
					})
					.where("id", "=", thread.id)
					.execute(),
			);

			return {
				...thread,
				archivedAt,
				updatedAt: archivedAt,
			};
		}),
	);
});

export type agentThreadArchiveFx = ReturnType<typeof agentThreadArchiveFx>;
