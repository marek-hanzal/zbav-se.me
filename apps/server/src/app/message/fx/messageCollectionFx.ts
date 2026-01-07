import { withCollectionFx } from "@use-pico/common/collection";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withMessageQueryBuilderFx } from "~/app/message/db/withMessageQueryBuilderFx";
import { withMessageSelectFx } from "~/app/message/db/withMessageSelectFx";
import type { MessageFilterSchema } from "~/app/message/schema/MessageFilterSchema";
import type { MessageQuerySchema } from "~/app/message/schema/MessageQuerySchema";

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
		selectFx: withMessageSelectFx({
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
