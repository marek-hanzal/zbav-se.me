import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageThreadQueryBuilderFx } from "~/app/message-thread/db/withMessageThreadQueryBuilderFx";
import { withMessageThreadSelectFx } from "~/app/message-thread/db/withMessageThreadSelectFx";
import type { MessageThreadQuerySchema } from "~/app/message-thread/schema/MessageThreadQuerySchema";
import { MessageThreadSchema } from "../schema/MessageThreadSchema";

export namespace messageThreadFetchFx {
	export type Props = MessageThreadQuerySchema.Type;
}

export const messageThreadFetchFx = Effect.fn("messageThreadFetchFx")(function* ({
	filter,
	where,
	sort,
}: messageThreadFetchFx.Props) {
	return yield* withFetchFx({
		resource: "messageThread",
		select: yield* withMessageThreadSelectFx({
			sort,
		}),
		output: MessageThreadSchema,
		filter,
		where,
		queryFx: withMessageThreadQueryBuilderFx,
	});
});

export type messageThreadFetchFx = ReturnType<typeof messageThreadFetchFx>;
