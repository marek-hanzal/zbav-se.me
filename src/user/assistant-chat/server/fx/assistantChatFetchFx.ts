import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withAssistantChatQueryBuilderFx } from "~/user/assistant-chat/server/db/withAssistantChatQueryBuilderFx";
import { withAssistantChatSelectFx } from "~/user/assistant-chat/server/db/withAssistantChatSelectFx";
import type { AssistantChatFilterSchema } from "~/user/assistant-chat/server/schema/AssistantChatFilterSchema";
import type { AssistantChatQuerySchema } from "~/user/assistant-chat/server/schema/AssistantChatQuerySchema";

export namespace assistantChatFetchFx {
	export interface Props extends AssistantChatQuerySchema.Type {
		scope: AssistantChatFilterSchema.Type;
	}
}

export const assistantChatFetchFx = Effect.fn("assistantChatFetchFx")(function* ({
	where,
	scope,
	sort,
}: assistantChatFetchFx.Props) {
	const logger = yield* getLoggerFx("assistantChatFetchFx");
	logger.debug("assistantChatFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "assistant_chat",
		selectFx: withAssistantChatSelectFx({
			sort,
		}),
		where,
		scope,
		queryFx: withAssistantChatQueryBuilderFx,
	});
});

export type assistantChatFetchFx = ReturnType<typeof assistantChatFetchFx>;
