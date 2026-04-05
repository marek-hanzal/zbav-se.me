import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withAssistantChatQueryBuilderFx } from "~/user/assistant-chat/server/db/withAssistantChatQueryBuilderFx";
import { withAssistantChatSourceSelectFx } from "~/user/assistant-chat/server/db/withAssistantChatSourceSelectFx";
import type { AssistantChatFilterSchema } from "~/user/assistant-chat/server/schema/AssistantChatFilterSchema";
import type { AssistantChatQuerySchema } from "~/user/assistant-chat/server/schema/AssistantChatQuerySchema";

export namespace assistantChatCountFx {
	export interface Props extends AssistantChatQuerySchema.Type {
		scope: AssistantChatFilterSchema.Type;
	}
}

export const assistantChatCountFx = Effect.fn("assistantChatCountFx")(function* ({
	where,
	scope,
	filter,
}: assistantChatCountFx.Props) {
	const logger = yield* getLoggerFx("assistantChatCountFx");
	logger.debug("assistantChatCountFx", {
		where,
		scope,
		filter,
	});

	return yield* withCountFx({
		selectFx: withAssistantChatSourceSelectFx({}),
		where,
		scope,
		filter,
		queryFx: withAssistantChatQueryBuilderFx,
	});
});

export type assistantChatCountFx = ReturnType<typeof assistantChatCountFx>;
