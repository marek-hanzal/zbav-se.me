import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withMessageLocationQueryBuilder } from "~/app/message-location/db/withMessageLocationQueryBuilder";
import { withMessageLocationSelect } from "~/app/message-location/db/withMessageLocationSelect";
import type { MessageLocationQuerySchema } from "~/app/message-location/schema/MessageLocationQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { MessageLocationSchema } from "../schema/MessageLocationSchema";

export namespace messageLocationFetchFx {
	export type Props = MessageLocationQuerySchema.Type;
}

export const messageLocationFetchFx = Effect.fn("messageLocationFetchFx")(function* ({
	filter,
	where,
	sort,
}: messageLocationFetchFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "message-location",
		select: withMessageLocationSelect({
			database,
			sort,
			userId: user.id,
		}),
		output: MessageLocationSchema,
		filter,
		where,
		query: withMessageLocationQueryBuilder,
	});
});

export type messageLocationFetchFx = ReturnType<typeof messageLocationFetchFx>;
