import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageThreadQueryBuilderFx } from "~/@user/message-thread/db/withMessageThreadQueryBuilderFx";
import { withMessageThreadSelectFx } from "~/@user/message-thread/db/withMessageThreadSelectFx";
import type { MessageThreadFilterSchema } from "~/@user/message-thread/schema/MessageThreadFilterSchema";
import type { MessageThreadQuerySchema } from "~/@user/message-thread/schema/MessageThreadQuerySchema";

export namespace messageThreadFetchFx {
	export interface Props extends MessageThreadQuerySchema.Type {
		scope: MessageThreadFilterSchema.Type;
	}
}

export const messageThreadFetchFx = Effect.fn("messageThreadFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: messageThreadFetchFx.Props) {
	return yield* withFetchFx({
		resource: "messageThread",
		selectFx: withMessageThreadSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withMessageThreadQueryBuilderFx,
	});
});

export type messageThreadFetchFx = ReturnType<typeof messageThreadFetchFx>;
