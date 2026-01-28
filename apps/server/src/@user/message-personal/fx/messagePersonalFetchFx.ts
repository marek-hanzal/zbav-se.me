import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessagePersonalQueryBuilderFx } from "~/@user/message-personal/db/withMessagePersonalQueryBuilderFx";
import { withMessagePersonalSelectFx } from "~/@user/message-personal/db/withMessagePersonalSelectFx";
import type { MessagePersonalFilterSchema } from "~/@user/message-personal/schema/MessagePersonalFilterSchema";
import type { MessagePersonalQuerySchema } from "~/@user/message-personal/schema/MessagePersonalQuerySchema";

export namespace messagePersonalFetchFx {
	export interface Props extends MessagePersonalQuerySchema.Type {
		userId: string;
		scope: MessagePersonalFilterSchema.Type;
	}
}

export const messagePersonalFetchFx = Effect.fn("messagePersonalFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
}: messagePersonalFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message_personal",
		selectFx: withMessagePersonalSelectFx({
			userId,
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withMessagePersonalQueryBuilderFx,
	});
});

export type messagePersonalFetchFx = ReturnType<typeof messagePersonalFetchFx>;
