import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import type { AgentThreadTableSchema } from "~/database/schema/AgentThreadTableSchema";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genId } from "~/identity/fn/genId";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace agentThreadCreateFx {
	export interface Props {
		userId: string;
	}
}

export const agentThreadCreateFx = Effect.fn("agentThreadCreateFx")(function* ({
	userId,
}: agentThreadCreateFx.Props) {
	const logger = yield* getLoggerFx("agentThreadCreateFx");
	logger.trace("agentThreadCreateFx", {
		userId,
	});

	const dateContext = yield* DateServiceFx;
	const id = genId();
	const now = dateContext.now().toJSDate();

	yield* dbFx(async (kysely) => {
		return kysely
			.insertInto("agent_thread")
			.values({
				id,
				userId,
				createdAt: now,
				updatedAt: now,
				archivedAt: null,
			})
			.execute();
	});

	return yield* Effect.succeed({
		id,
		userId,
		createdAt: now,
		updatedAt: now,
		archivedAt: null,
	} satisfies AgentThreadTableSchema.Type);
});

export type agentThreadCreateFx = ReturnType<typeof agentThreadCreateFx>;
