import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { MessageSystemSchema } from "~/@user/message-system/schema/MessageSystemSchema";
import { withMessageSystemQueryBuilder } from "~/app/message-system/db/withMessageSystemQueryBuilder";
import { withMessageSystemSelect } from "~/app/message-system/db/withMessageSystemSelect";
import type { MessageSystemQuerySchema } from "~/app/message-system/schema/MessageSystemQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace messageSystemFetchFx {
	export type Props = MessageSystemQuerySchema.Type;
}

export const messageSystemFetchFx = Effect.fn("messageSystemFetchFx")(function* ({
	filter,
	where,
	sort,
}: messageSystemFetchFx.Props) {
	const database = yield* DatabaseContextFx;

	return yield* withFetchFx({
		resource: "message-system",
		select: withMessageSystemSelect({
			database,
			sort,
		}),
		output: MessageSystemSchema,
		filter,
		where,
		queryFx: withMessageSystemQueryBuilder,
	});
});

export type messageSystemFetchFx = ReturnType<typeof messageSystemFetchFx>;
