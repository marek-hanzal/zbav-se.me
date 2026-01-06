import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { MessageSystemSchema } from "~/@user/message-system/schema/MessageSystemSchema";
import { withMessageSystemQueryBuilderFx } from "~/app/message-system/db/withMessageSystemQueryBuilderFx";
import { withMessageSystemSelectFx} from "~/app/message-system/db/withMessageSystemSelectFx;
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
		select: withMessageSystemSelectFx{
			database,
			sort,
		}),
		output: MessageSystemSchema,
		filter,
		where,
		queryFx: withMessageSystemQueryBuilderFx,
	});
});

export type messageSystemFetchFx = ReturnType<typeof messageSystemFetchFx>;
