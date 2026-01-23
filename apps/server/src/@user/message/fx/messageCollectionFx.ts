import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withMessageCollectionSelectFx } from "~/@user/message/db/withMessageCollectionSelectFx";
import { withMessageQueryBuilderFx } from "~/@user/message/db/withMessageQueryBuilderFx";
import type { MessageFilterSchema } from "~/@user/message/schema/MessageFilterSchema";
import type { MessageQuerySchema } from "~/@user/message/schema/MessageQuerySchema";

export namespace messageCollectionFx {
	export interface Props extends MessageQuerySchema.Type {
		userId: string;
		scope?: MessageFilterSchema.Type;
	}
}

export const messageCollectionFx = Effect.fn("messageCollectionFx")(function* ({
	userId,
	cursor,
	filter,
	where,
	scope,
	sort,
}: messageCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withMessageCollectionSelectFx({
			userId,
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 30,
		},
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

export type messageCollectionFx = ReturnType<typeof messageCollectionFx>;
