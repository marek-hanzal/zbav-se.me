import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
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
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;
			const archivedAt = dateContext.now().toJSDate();

			const { select, queryFx } = yield* withAgentThreadSelectFx({});

			const query = yield* queryFx(select, {
				archivedAt: "any",
				userId,
			});

			const selectIds = query.clearSelect().select("at.id");

			yield* tryDbFx(async () => {
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
