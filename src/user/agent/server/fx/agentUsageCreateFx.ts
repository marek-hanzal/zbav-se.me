import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import type { AgentUsageCreateSchema } from "~/user/agent/server/schema/AgentUsageCreateSchema";

export namespace agentUsageCreateFx {
	export interface Props extends AgentUsageCreateSchema.Type {
		userId: string;
	}
}

export const agentUsageCreateFx = Effect.fn("agentUsageCreateFx")(function* ({
	userId,
	threadId,
	requests,
	input,
	total,
	output,
}: agentUsageCreateFx.Props) {
	const logger = yield* getLoggerFx("agentUsageCreateFx");
	logger.trace("agentUsageCreateFx", {
		userId,
		threadId,
		requests,
		input,
		total,
		output,
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	yield* tryDbFx(async () =>
		kysely
			.insertInto("agent_usage")
			.values({
				id: genId(),
				userId,
				threadId,
				requests,
				input,
				total,
				output,
				createdAt: dateContext.now().toJSDate(),
			})
			.execute(),
	);
});

export type agentUsageCreateFx = ReturnType<typeof agentUsageCreateFx>;
