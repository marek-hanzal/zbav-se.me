import { withFetchFx } from "@use-pico/common/fetch";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withMessageLocationQueryBuilderFx } from "~/app/message-location/db/withMessageLocationQueryBuilderFx";
import { withMessageLocationSelectFx } from "~/app/message-location/db/withMessageLocationSelectFx";
import type { MessageLocationFilterSchema } from "~/app/message-location/schema/MessageLocationFilterSchema";
import type { MessageLocationQuerySchema } from "~/app/message-location/schema/MessageLocationQuerySchema";

export namespace messageLocationFetchFx {
	export interface Props extends MessageLocationQuerySchema.Type {
		userId: string;
		scope: MessageLocationFilterSchema.Type;
	}
}

export const messageLocationFetchFx = Effect.fn("messageLocationFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
}: messageLocationFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message-location",
		selectFx: withMessageLocationSelectFx({
			userId,
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withMessageLocationQueryBuilderFx,
	});
});

export type messageLocationFetchFx = ReturnType<typeof messageLocationFetchFx>;

