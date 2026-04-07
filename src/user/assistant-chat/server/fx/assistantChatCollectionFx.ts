import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withAssistantChatCollectionSelectFx } from "~/user/assistant-chat/server/db/withAssistantChatCollectionSelectFx";
import { withAssistantChatQueryBuilderFx } from "~/user/assistant-chat/server/db/withAssistantChatQueryBuilderFx";
import type { AssistantChatFilterSchema } from "~/user/assistant-chat/server/schema/AssistantChatFilterSchema";
import type { AssistantChatQuerySchema } from "~/user/assistant-chat/server/schema/AssistantChatQuerySchema";

export namespace assistantChatCollectionFx {
	export interface Props extends AssistantChatQuerySchema.Type {
		scope: AssistantChatFilterSchema.Type;
	}
}

export const assistantChatCollectionFx = Effect.fn("assistantChatCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor = {
		page: 0,
		size: 10,
	},
	sort,
}: assistantChatCollectionFx.Props) {
	const logger = yield* getLoggerFx("assistantChatCollectionFx");
	logger.trace("assistantChatCollectionFx", {
		filter,
		where,
		scope,
		cursor,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withAssistantChatCollectionSelectFx({
			sort,
		}),
		cursor,
		filter,
		where,
		scope,
		queryFx: withAssistantChatQueryBuilderFx,
	});
});

export type assistantChatCollectionFx = ReturnType<typeof assistantChatCollectionFx>;
