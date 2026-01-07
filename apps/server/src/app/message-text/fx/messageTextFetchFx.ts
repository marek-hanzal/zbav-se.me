import { withFetchFx } from "@use-pico/common/fetch";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withMessageTextQueryBuilderFx } from "~/app/message-text/db/withMessageTextQueryBuilderFx";
import { withMessageTextSelectFx } from "~/app/message-text/db/withMessageTextSelectFx";
import type { MessageTextFilterSchema } from "~/app/message-text/schema/MessageTextFilterSchema";
import type { MessageTextQuerySchema } from "~/app/message-text/schema/MessageTextQuerySchema";

export namespace messageTextFetchFx {
	export interface Props extends MessageTextQuerySchema.Type {
		userId: string;
		scope: MessageTextFilterSchema.Type;
	}
}

export const messageTextFetchFx = Effect.fn("messageTextFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
}: messageTextFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message-text",
		selectFx: withMessageTextSelectFx({
			userId,
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withMessageTextQueryBuilderFx,
	});
});

export type messageTextFetchFx = ReturnType<typeof messageTextFetchFx>;

