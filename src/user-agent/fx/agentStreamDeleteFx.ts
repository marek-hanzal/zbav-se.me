import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { agentStreamFetchFx } from "~/user-agent/fx/agentStreamFetchFx";
import type { AgentStreamQuerySchema } from "~/user-agent/schema/AgentStreamQuerySchema";
import type { AgentStreamWhereSchema } from "~/user-agent/schema/AgentStreamWhereSchema";

export namespace agentStreamDeleteFx {
	export interface Props extends Omit<AgentStreamQuerySchema.Type, "cursor" | "sort"> {
		scope: AgentStreamWhereSchema.Type;
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
			const stream = yield* agentStreamFetchFx(query);

			yield* dbFx(async (kysely) => {
				return kysely.deleteFrom("agent_stream").where("id", "=", stream.id).execute();
			});

			return stream;
		}),
	);
});

export type agentStreamDeleteFx = ReturnType<typeof agentStreamDeleteFx>;
