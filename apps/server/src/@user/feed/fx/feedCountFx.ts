import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFeedQueryBuilder } from "~/app/feed/db/withFeedQueryBuilder";
import { withFeedSelect } from "~/app/feed/db/withFeedSelect";
import type { FeedCountQuerySchema } from "~/app/feed/schema/FeedCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace feedCountFx {
	export type Props = FeedCountQuerySchema.Type;
}

export const feedCountFx = Effect.fn("feedCountFx")(function* ({
	filter,
	where,
}: feedCountFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withCountFx({
		select: withFeedSelect({
			database,
			sort: undefined,
		}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withFeedQueryBuilder,
	});
});

export type feedCountFx = ReturnType<typeof feedCountFx>;
