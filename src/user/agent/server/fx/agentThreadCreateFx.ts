import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { AgentThreadTableSchema } from "~/server/database/@table/AgentThreadTableSchema";
import { dbFx } from "~/server/database/fx/dbFx";

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
