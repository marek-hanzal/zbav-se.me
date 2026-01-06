import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withFeedQueryBuilderFx } from "~/app/feed/db/withFeedQueryBuilderFx";
import { withFeedSelectFx } from "~/app/feed/db/withFeedSelectFx";
import type { FeedCountQuerySchema } from "~/app/feed/schema/FeedCountQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace feedCountFx {
	export type Props = FeedCountQuerySchema.Type;
}

export const feedCountFx = Effect.fn("feedCountFx")(function* ({
	filter,
	where,
}: feedCountFx.Props) {
	const user = yield* UserContextFx;

	return yield* withCountFx({
		select: yield* withFeedSelectFx({}),
		filter,
		where: {
			...where,
			userId: user.id,
		},
		queryFx: withFeedQueryBuilderFx,
	});
});

export type feedCountFx = ReturnType<typeof feedCountFx>;
