import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withFeedQueryBuilderFx } from "~/app/feed/db/withFeedQueryBuilderFx";
import { withFeedSelectFx } from "~/app/feed/db/withFeedSelectFx";
import type { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { FeedSchema } from "../schema/FeedSchema";

export namespace feedFetchFx {
	export type Props = FeedQuerySchema.Type;
}

export const feedFetchFx = Effect.fn("feedFetchFx")(function* ({
	filter,
	where,
	sort,
}: feedFetchFx.Props) {
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "feed",
		select: yield* withFeedSelectFx({
			sort,
		}),
		output: FeedSchema,
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withFeedQueryBuilderFx,
	});
});

export type feedFetchFx = ReturnType<typeof feedFetchFx>;
