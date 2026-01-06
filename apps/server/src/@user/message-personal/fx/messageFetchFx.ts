import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { MessagePersonalSchema } from "~/@user/message-personal/schema/MessagePersonalSchema";
import { withMessagePersonalQueryBuilderFx } from "~/app/message-personal/db/withMessagePersonalQueryBuilderFx";
import { withMessagePersonalSelectFx} from "~/app/message-personal/db/withMessagePersonalSelectFx;
import type { MessagePersonalQuerySchema } from "~/app/message-personal/schema/MessagePersonalQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace messagePersonalFetchFx {
	export type Props = MessagePersonalQuerySchema.Type;
}

export const messagePersonalFetchFx = Effect.fn("messagePersonalFetchFx")(function* ({
	filter,
	where,
	sort,
}: messagePersonalFetchFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "message_personal",
		select: withMessagePersonalSelectFx{
			database,
			sort,
			userId: user.id,
		}),
		output: MessagePersonalSchema,
		filter,
		where,
		queryFx: withMessagePersonalQueryBuilderFx,
	});
});

export type messagePersonalFetchFx = ReturnType<typeof messagePersonalFetchFx>;
