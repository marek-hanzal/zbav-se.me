import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageTextQueryBuilderFx } from "~/app/message-text/db/withMessageTextQueryBuilderFx";
import { withMessageTextSelectFx } from "~/app/message-text/db/withMessageTextSelectFx";
import type { MessageTextFilterSchema } from "~/app/message-text/schema/MessageTextFilterSchema";
import type { MessageTextQuerySchema } from "~/app/message-text/schema/MessageTextQuerySchema";

export namespace messageTextFetchFx {
	export type Props = MessageTextQuerySchema.Type & {
		scope?: MessageTextFilterSchema.Type;
	};
}

export const messageTextFetchFx = Effect.fn("messageTextFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: messageTextFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message-text",
		selectFx: withMessageTextSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withMessageTextQueryBuilderFx,
	});
});

export type messageTextFetchFx = ReturnType<typeof messageTextFetchFx>;
