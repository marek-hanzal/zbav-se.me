import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { MessageTextSchema } from "~/@user/message-text/schema/MessageTextSchema";
import { withMessageTextQueryBuilder } from "~/app/message-text/db/withMessageTextQueryBuilder";
import { withMessageTextSelect } from "~/app/message-text/db/withMessageTextSelect";
import type { MessageTextQuerySchema } from "~/app/message-text/schema/MessageTextQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace messageTextFetchFx {
	export type Props = MessageTextQuerySchema.Type;
}

export const messageTextFetchFx = Effect.fn("messageTextFetchFx")(function* ({
	filter,
	where,
	sort,
}: messageTextFetchFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "message-text",
		select: withMessageTextSelect({
			database,
			sort,
			userId: user.id,
		}),
		output: MessageTextSchema,
		filter,
		where,
		queryFx: withMessageTextQueryBuilder,
	});
});

export type messageTextFetchFx = ReturnType<typeof messageTextFetchFx>;
