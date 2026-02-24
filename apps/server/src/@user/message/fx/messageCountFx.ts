import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withMessageCollectionSelectFx } from "~/@user/message/db/withMessageCollectionSelectFx";
import { withMessageQueryBuilderFx } from "~/@user/message/db/withMessageQueryBuilderFx";
import type { MessageCountQuerySchema } from "~/@user/message/schema/MessageCountQuerySchema";
import type { MessageFilterSchema } from "~/@user/message/schema/MessageFilterSchema";

export namespace messageCountFx {
	export interface Props extends MessageCountQuerySchema.Type {
		userId: string;
		scope?: MessageFilterSchema.Type;
	}
}

export const messageCountFx = Effect.fn("messageCountFx")(function* ({
	userId,
	filter,
	where,
	scope,
}: messageCountFx.Props) {
	return yield* withCountFx({
		selectFx: withMessageCollectionSelectFx({
			userId,
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

export type messageCountFx = ReturnType<typeof messageCountFx>;
