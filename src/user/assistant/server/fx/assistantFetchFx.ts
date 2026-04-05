import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withAssistantQueryBuilderFx } from "~/user/assistant/server/db/withAssistantQueryBuilderFx";
import { withAssistantSelectFx } from "~/user/assistant/server/db/withAssistantSelectFx";
import type { AssistantFilterSchema } from "~/user/assistant/server/schema/AssistantFilterSchema";
import type { AssistantQuerySchema } from "~/user/assistant/server/schema/AssistantQuerySchema";

export namespace assistantFetchFx {
	export interface Props extends AssistantQuerySchema.Type {
		scope: AssistantFilterSchema.Type;
	}
}

export const assistantFetchFx = Effect.fn("assistantFetchFx")(function* ({
	where,
	scope,
	sort,
}: assistantFetchFx.Props) {
	const logger = yield* getLoggerFx("assistantFetchFx");
	logger.debug("assistantFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "assistant",
		selectFx: withAssistantSelectFx({
			sort,
		}),
		where,
		scope,
		queryFx: withAssistantQueryBuilderFx,
	});
});

export type assistantFetchFx = ReturnType<typeof assistantFetchFx>;
