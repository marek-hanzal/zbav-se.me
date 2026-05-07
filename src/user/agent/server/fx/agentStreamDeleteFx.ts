import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { agentStreamFetchFx } from "~/user/agent/server/fx/agentStreamFetchFx";
import type { AgentStreamFilterSchema } from "~/user/agent/server/schema/AgentStreamFilterSchema";
import type { AgentStreamQuerySchema } from "~/user/agent/server/schema/AgentStreamQuerySchema";

export namespace agentStreamDeleteFx {
	export interface Props extends Omit<AgentStreamQuerySchema.Type, "cursor" | "sort"> {
		scope: AgentStreamFilterSchema.Type;
	}
}

export const agentStreamDeleteFx = Effect.fn("agentStreamDeleteFx")(function* (
	query: agentStreamDeleteFx.Props,
) {
	const logger = yield* getLoggerFx("agentStreamDeleteFx");
	logger.trace("agentStreamDeleteFx", {
		...query,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const stream = yield* agentStreamFetchFx(query);

			yield* tryDbFx(async () =>
				kysely.deleteFrom("agent_stream").where("id", "=", stream.id).execute(),
			);

			return stream;
		}),
	);
});

export type agentStreamDeleteFx = ReturnType<typeof agentStreamDeleteFx>;
