import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageThreadQueryBuilder } from "~/app/message-thread/db/withMessageThreadQueryBuilder";
import { withMessageThreadSelect } from "~/app/message-thread/db/withMessageThreadSelect";
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
		select: withMessageThreadSelect({
			database,
			sort,
		}),
		output: MessageThreadSchema,
		filter,
		where,
		queryFx: withMessageThreadQueryBuilder,
	});
});

export type messageThreadFetchFx = ReturnType<typeof messageThreadFetchFx>;
