import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageQueryBuilderFx } from "~/@user/message/db/withMessageQueryBuilderFx";
import { withMessageSelectFx } from "~/@user/message/db/withMessageSelectFx";
import type { MessageFilterSchema } from "~/@user/message/schema/MessageFilterSchema";
import type { MessageQuerySchema } from "~/@user/message/schema/MessageQuerySchema";

export namespace messageFetchFx {
	export interface Props extends MessageQuerySchema.Type {
		userId: string;
		scope?: MessageFilterSchema.Type;
	}
}

export const messageFetchFx = Effect.fn("messageFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
}: messageFetchFx.Props) {
	return yield* withFetchFx({
		resource: "message",
		selectFx: withMessageSelectFx({
			userId,
			sort,
		}),
		filter,
		where,
		scope,
		queryFx(query) {
			return withMessageQueryBuilderFx({
				...query,
				userId,
			});
		},
	});
});

export type messageFetchFx = ReturnType<typeof messageFetchFx>;
