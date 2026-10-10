import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withAgentThreadSelectFx } from "~/user-agent/db/withAgentThreadSelectFx";
import { agentThreadCreateFx } from "~/user-agent/fx/agentThreadCreateFx";

export namespace agentThreadCreateSessionFx {
	export interface Props {
		userId: string;
	}
}

export const agentThreadCreateSessionFx = Effect.fn("agentThreadCreateSessionFx")(function* ({
	userId,
}: agentThreadCreateSessionFx.Props) {
	const logger = yield* getLoggerFx("agentThreadCreateSessionFx");
	logger.trace("agentThreadCreateSessionFx", {
		userId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateServiceFx;
			const archivedAt = dateContext.nowFn().toJSDate();

			const { select, queryFx } = yield* withAgentThreadSelectFx({});

			const query = yield* queryFx(select, {
				archivedAt: "any",
				userId,
			});

			const selectIds = query.clearSelect().select("at.id");

			yield* dbFx(async (kysely) => {
				return kysely
					.updateTable("agent_thread")
					.set({
						archivedAt,
						updatedAt: archivedAt,
					})
					.where("id", "in", selectIds)
					.execute();
			});

			return yield* agentThreadCreateFx({
				userId,
			});
		}),
	);
});

export type agentThreadCreateSessionFx = ReturnType<typeof agentThreadCreateSessionFx>;
