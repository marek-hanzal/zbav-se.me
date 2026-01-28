import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageSystemQueryBuilderFx } from "~/@user/message-system/db/withMessageSystemQueryBuilderFx";
import { withMessageSystemSelectFx } from "~/@user/message-system/db/withMessageSystemSelectFx";
import type { MessageSystemFilterSchema } from "~/@user/message-system/schema/MessageSystemFilterSchema";
import type { MessageSystemQuerySchema } from "~/@user/message-system/schema/MessageSystemQuerySchema";

export namespace messageSystemFetchFx {
	export interface Props extends MessageSystemQuerySchema.Type {
		scope: MessageSystemFilterSchema.Type;
	}
}

export const messageSystemFetchFx = Effect.fn("messageSystemFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: messageSystemFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message-system",
		selectFx: withMessageSystemSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withMessageSystemQueryBuilderFx,
	});
});

export type messageSystemFetchFx = ReturnType<typeof messageSystemFetchFx>;
