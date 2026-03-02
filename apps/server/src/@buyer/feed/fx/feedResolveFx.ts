import { Effect } from "effect";
import { feedFetchFx } from "~/@buyer/feed/fx/feedFetchFx";
import { withTraceFx } from "~/effect/withTraceFx";
import { AccessDeniedErrorFx } from "~/error/AccessDeniedErrorFx";

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
		yield* withTraceFx({
			fx: "feedResolveFx",
			error: {
				message,
			},
		});
		return yield* new AccessDeniedErrorFx({
			message,
		});
	}

	return feed;
});

export type feedResolveFx = ReturnType<typeof feedResolveFx>;
