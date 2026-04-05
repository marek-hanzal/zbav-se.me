import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withAssistantCollectionSelectFx } from "~/user/assistant/server/db/withAssistantCollectionSelectFx";
import { withAssistantQueryBuilderFx } from "~/user/assistant/server/db/withAssistantQueryBuilderFx";
import type { AssistantFilterSchema } from "~/user/assistant/server/schema/AssistantFilterSchema";
import type { AssistantQuerySchema } from "~/user/assistant/server/schema/AssistantQuerySchema";

export namespace assistantCollectionFx {
	export interface Props extends AssistantQuerySchema.Type {
		scope: AssistantFilterSchema.Type;
	}
}

export const assistantCollectionFx = Effect.fn("assistantCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor = {
		page: 0,
		size: 10,
	},
	sort,
}: assistantCollectionFx.Props) {
	const logger = yield* getLoggerFx("assistantCollectionFx");

	logger.debug("assistantCollectionFx", {
		filter,
		where,
		scope,
		cursor,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withAssistantCollectionSelectFx({
			sort,
		}),
		cursor,
		filter,
		where,
		scope,
		queryFx: withAssistantQueryBuilderFx,
	});
});

export type assistantCollectionFx = ReturnType<typeof assistantCollectionFx>;
