import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withAssistantQueryBuilderFx } from "~/user/assistant/server/db/withAssistantQueryBuilderFx";
import { withAssistantSourceSelectFx } from "~/user/assistant/server/db/withAssistantSourceSelectFx";
import type { AssistantFilterSchema } from "~/user/assistant/server/schema/AssistantFilterSchema";
import type { AssistantQuerySchema } from "~/user/assistant/server/schema/AssistantQuerySchema";

export namespace assistantCountFx {
	export interface Props extends AssistantQuerySchema.Type {
		scope: AssistantFilterSchema.Type;
	}
}

export const assistantCountFx = Effect.fn("assistantCountFx")(function* ({
	where,
	scope,
	filter,
}: assistantCountFx.Props) {
	const logger = yield* getLoggerFx("assistantCountFx");
	logger.debug("assistantCountFx", {
		where,
		scope,
		filter,
	});

	return yield* withCountFx({
		selectFx: withAssistantSourceSelectFx({}),
		where,
		scope,
		filter,
		queryFx: withAssistantQueryBuilderFx,
	});
});

export type assistantCountFx = ReturnType<typeof assistantCountFx>;
