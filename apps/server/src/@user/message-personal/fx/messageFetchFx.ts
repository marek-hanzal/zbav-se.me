import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { MessagePersonalSchema } from "~/@user/message-personal/schema/MessagePersonalSchema";
import { withMessagePersonalQueryBuilderFx } from "~/app/message-personal/db/withMessagePersonalQueryBuilderFx";
import { withMessagePersonalSelectFx } from "~/app/message-personal/db/withMessagePersonalSelectFx";
import type { MessagePersonalQuerySchema } from "~/app/message-personal/schema/MessagePersonalQuerySchema";

export namespace messagePersonalFetchFx {
	export type Props = MessagePersonalQuerySchema.Type;
}

export const messagePersonalFetchFx = Effect.fn("messagePersonalFetchFx")(function* ({
	filter,
	where,
	sort,
}: messagePersonalFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message_personal",
		select: yield* withMessagePersonalSelectFx({
			sort,
		}),
		output: MessagePersonalSchema,
		filter,
		where,
		queryFx: withMessagePersonalQueryBuilderFx,
	});
});

export type messagePersonalFetchFx = ReturnType<typeof messagePersonalFetchFx>;
