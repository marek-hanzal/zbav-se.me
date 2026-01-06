import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withMessageQueryBuilderFx } from "~/@user/message/db/withMessageQueryBuilderFx";
import { MessageSchema } from "~/@user/message/schema/MessageSchema";
import { withMessageSelectFx } from "~/app/message/db/withMessageSelectFx";
import type { MessageQuerySchema } from "~/app/message/schema/MessageQuerySchema";
export namespace messageCollectionFx {
	export type Props = MessageQuerySchema.Type;
}

export const messageCollectionFx = Effect.fn("messageCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: messageCollectionFx.Props) {
	return yield* withCollectionFx({
		select: yield* withMessageSelectFx({
			sort,
		}),
		output: MessageSchema,
		cursor: cursor ?? {
			page: 0,
			size: 30,
		},
		filter,
		where,
		queryFx: withMessageQueryBuilderFx,
	});
});

export type messageCollectionFx = ReturnType<typeof messageCollectionFx>;
