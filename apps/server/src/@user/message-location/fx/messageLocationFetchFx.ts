import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageLocationQueryBuilderFx } from "~/app/message-location/db/withMessageLocationQueryBuilderFx";
import { withMessageLocationSelectFx } from "~/app/message-location/db/withMessageLocationSelectFx";
import type { MessageLocationQuerySchema } from "~/app/message-location/schema/MessageLocationQuerySchema";
import { MessageLocationSchema } from "../schema/MessageLocationSchema";

export namespace messageLocationFetchFx {
	export type Props = MessageLocationQuerySchema.Type;
}

export const messageLocationFetchFx = Effect.fn("messageLocationFetchFx")(function* ({
	filter,
	where,
	sort,
}: messageLocationFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message-location",
		select: yield* withMessageLocationSelectFx({
			sort,
		}),
		output: MessageLocationSchema,
		filter,
		where,
		queryFx: withMessageLocationQueryBuilderFx,
	});
});

export type messageLocationFetchFx = ReturnType<typeof messageLocationFetchFx>;
