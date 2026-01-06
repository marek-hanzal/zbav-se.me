import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withMessageQueryBuilderFx } from "~/@user/message/db/withMessageQueryBuilderFx";
import { withMessageSelectFx } from "~/app/message/db/withMessageSelectFx";
import type { MessageFilterSchema } from "~/app/message/schema/MessageFilterSchema";
import type { MessageQuerySchema } from "~/app/message/schema/MessageQuerySchema";
export namespace messageCollectionFx {
	export interface Props extends MessageQuerySchema.Type {
		scope?: MessageFilterSchema.Type;
	}
}

export const messageCollectionFx = Effect.fn("messageCollectionFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: messageCollectionFx.Props) {
	return yield* withCollectionFx({
		selectFx: withMessageSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 30,
		},
		filter,
		where,
		scope,
		queryFx: withMessageQueryBuilderFx,
	});
});

export type messageCollectionFx = ReturnType<typeof messageCollectionFx>;
