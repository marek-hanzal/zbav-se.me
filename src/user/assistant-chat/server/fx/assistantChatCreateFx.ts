import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { assistantChatFetchFx } from "~/user/assistant-chat/server/fx/assistantChatFetchFx";
import type { AssistantChatCreateSchema } from "~/user/assistant-chat/server/schema/AssistantChatCreateSchema";

export namespace assistantChatCreateFx {
	export interface Props extends AssistantChatCreateSchema.Type {
		userId: string;
	}
}

export const assistantChatCreateFx = Effect.fn("assistantChatCreateFx")(function* ({
	userId,
	payload,
}: assistantChatCreateFx.Props) {
	const logger = yield* getLoggerFx("assistantChatCreateFx");
	logger.debug("assistantChatCreateFx", {
		userId,
		payload,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now();

			yield* tryDbFx(async () => {
				return kysely
					.insertInto("assistant_chat")
					.values({
						id,
						userId,
						payload,
						createdAt: now.toJSDate().toISOString(),
					})
					.executeTakeFirstOrThrow();
			});

			return yield* assistantChatFetchFx({
				where: {
					id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type assistantChatCreateFx = ReturnType<typeof assistantChatCreateFx>;
