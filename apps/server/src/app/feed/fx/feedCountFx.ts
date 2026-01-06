import { withCountFx } from "@use-pico/common/count";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withFeedQueryBuilderFx } from "~/app/feed/db/withFeedQueryBuilderFx";
import { withFeedSelectFx } from "~/app/feed/db/withFeedSelectFx";
import type { FeedCountQuerySchema } from "~/app/feed/schema/FeedCountQuerySchema";
import type { FeedFilterSchema } from "~/app/feed/schema/FeedFilterSchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace feedCountFx {
	export interface Props extends FeedCountQuerySchema.Type {
		scope: FeedFilterSchema.Type;
	}
}

export const feedCountFx = Effect.fn("feedCountFx")(function* ({
	filter,
	where,
	scope,
}: feedCountFx.Props) {
	return yield* withCountFx({
		selectFx: withFeedSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withFeedQueryBuilderFx,
	});
});

export type feedCountFx = ReturnType<typeof feedCountFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<feedCountFx>, UserContextFx>>;
