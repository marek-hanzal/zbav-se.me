import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageThreadQueryBuilderFx } from "~/app/message-thread/db/withMessageThreadQueryBuilderFx";
import { withMessageThreadSelectFx} from "~/app/message-thread/db/withMessageThreadSelectFx;
import type { MessageThreadQuerySchema } from "~/app/message-thread/schema/MessageThreadQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { MessageThreadSchema } from "../schema/MessageThreadSchema";

export namespace messageThreadFetchFx {
	export type Props = MessageThreadQuerySchema.Type;
}

export const messageThreadFetchFx = Effect.fn("messageThreadFetchFx")(function* ({
	filter,
	where,
	sort,
}: messageThreadFetchFx.Props) {
	const database = yield* DatabaseContextFx;

	return yield* withFetchFx({
		resource: "messageThread",
		select: withMessageThreadSelectFx{
			database,
			sort,
		}),
		output: MessageThreadSchema,
		filter,
		where,
		queryFx: withMessageThreadQueryBuilderFx,
	});
});

export type messageThreadFetchFx = ReturnType<typeof messageThreadFetchFx>;
