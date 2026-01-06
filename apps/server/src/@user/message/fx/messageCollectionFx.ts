import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withMessageQueryBuilder } from "~/@user/message/db/withMessageQueryBuilder";
import { MessageSchema } from "~/@user/message/schema/MessageSchema";
import { withMessageSelect } from "~/app/message/db/withMessageSelect";
import type { MessageQuerySchema } from "~/app/message/schema/MessageQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace messageCollectionFx {
	export type Props = MessageQuerySchema.Type;
}

export const messageCollectionFx = Effect.fn("messageCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: messageCollectionFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: withMessageSelect({
			database,
			sort,
			userId: user.id,
		}),
		output: MessageSchema,
		cursor: cursor ?? {
			page: 0,
			size: 30,
		},
		filter,
		where,
		query(props) {
			return withMessageQueryBuilder({
				...props,
				userId: user.id,
			});
		},
	});
});

export type messageCollectionFx = ReturnType<typeof messageCollectionFx>;
