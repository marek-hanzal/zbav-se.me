import { withFetchFx } from "@use-pico/common/fetch";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withMessageSystemQueryBuilderFx } from "~/app/message-system/db/withMessageSystemQueryBuilderFx";
import { withMessageSystemSelectFx } from "~/app/message-system/db/withMessageSystemSelectFx";
import type { MessageSystemFilterSchema } from "~/app/message-system/schema/MessageSystemFilterSchema";
import type { MessageSystemQuerySchema } from "~/app/message-system/schema/MessageSystemQuerySchema";

export namespace messageSystemFetchFx {
	export interface Props extends MessageSystemQuerySchema.Type {
		scope: MessageSystemFilterSchema.Type;
	}
}

export const messageSystemFetchFx = Effect.fn("messageSystemFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: messageSystemFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message-system",
		selectFx: withMessageSystemSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withMessageSystemQueryBuilderFx,
	});
});

export type messageSystemFetchFx = ReturnType<typeof messageSystemFetchFx>;
