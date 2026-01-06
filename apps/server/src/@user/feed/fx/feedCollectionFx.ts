import { withCollectionFx } from "@use-pico/common/collection";
import { EntitySchema } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withFeedCollectionSelectFx } from "~/app/feed/db/withFeedCollectionSelectFx";
import { withFeedQueryBuilderFx } from "~/app/feed/db/withFeedQueryBuilderFx";
import type { FeedQuerySchema } from "~/app/feed/schema/FeedQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace feedCollectionFx {
	export type Props = FeedQuerySchema.Type;
}

export const feedCollectionFx = Effect.fn("feedCollectionFx")(function* ({
	cursor,
	filter,
	where,
	sort,
}: feedCollectionFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCollectionFx({
		select: yield* withFeedCollectionSelectFx({
			sort,
		}),
		output: EntitySchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withFeedQueryBuilderFx,
	});
});

export type feedCollectionFx = ReturnType<typeof feedCollectionFx>;
