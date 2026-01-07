import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { feedFetchFx } from "~/app/feed/fx/feedFetchFx";
import { AccessDeniedError } from "~/error/AccessDeniedError";

export namespace feedResolveFx {
	export interface Props {
		userId: string;
		feedId: string;
		message?: string;
	}
}

export const feedResolveFx = Effect.fn("feedResolveFx")(function* ({
	userId,
	feedId,
	message = "You are not allowed to access this feed",
}: feedResolveFx.Props) {
	const feed = yield* feedFetchFx({
		where: {
			id: feedId,
		},
		scope: {
			userId,
		},
	});

	if (feed.userId !== userId) {
		return yield* new AccessDeniedError({
			message,
		});
	}

	return feed;
});

export type feedResolveFx = ReturnType<typeof feedResolveFx>;
