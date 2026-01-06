import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { MessageTextSchema } from "~/@user/message-text/schema/MessageTextSchema";
import { withMessageTextQueryBuilderFx } from "~/app/message-text/db/withMessageTextQueryBuilderFx";
import { withMessageTextSelectFx } from "~/app/message-text/db/withMessageTextSelectFx";
import type { MessageTextQuerySchema } from "~/app/message-text/schema/MessageTextQuerySchema";

export namespace messageTextFetchFx {
	export type Props = MessageTextQuerySchema.Type;
}

export const messageTextFetchFx = Effect.fn("messageTextFetchFx")(function* ({
	filter,
	where,
	sort,
}: messageTextFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message-text",
		select: yield* withMessageTextSelectFx({
			sort,
		}),
		output: MessageTextSchema,
		filter,
		where,
		queryFx: withMessageTextQueryBuilderFx,
	});
});

export type messageTextFetchFx = ReturnType<typeof messageTextFetchFx>;
