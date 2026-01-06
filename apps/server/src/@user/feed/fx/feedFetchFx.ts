import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFeedQueryBuilder } from "~/app/feed/db/withFeedQueryBuilder";
import { withFeedSelectFx } from "~/app/feed/db/withFeedSelectFx";
import type { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { FeedSchema } from "../schema/FeedSchema";

export namespace feedFetchFx {
	export type Props = FeedQuerySchema.Type;
}

export const feedFetchFx = Effect.fn("feedFetchFx")(function* ({
	filter,
	where,
	sort,
}: feedFetchFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "feed",
		select: yield* withFeedSelectFx({
			database,
			sort,
		}),
		output: FeedSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		query: withFeedQueryBuilder,
	});
});

export type feedFetchFx = ReturnType<typeof feedFetchFx>;
