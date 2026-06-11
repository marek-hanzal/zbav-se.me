import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { withAgentThreadSelectFx } from "~/user/agent/server/db/withAgentThreadSelectFx";
import { agentThreadCreateFx } from "~/user/agent/server/fx/agentThreadCreateFx";

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
			const archivedAt = dateContext.now().toJSDate();

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
