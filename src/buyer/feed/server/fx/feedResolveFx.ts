import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { feedFetchFx } from "~/buyer/feed/server/fx/feedFetchFx";
import { AccessDeniedErrorFx } from "~/server/error/AccessDeniedErrorFx";

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
	const logger = yield* getLoggerFx("feedResolveFx");
	logger.trace("feedResolveFx", {
		userId,
		feedId,
		message,
	});

	const feed = yield* feedFetchFx({
		where: {
			id: feedId,
		},
		scope: {},
	});

	if (feed.userId !== userId) {
		return yield* new AccessDeniedErrorFx({
			message,
		});
	}

	return feed;
});

export type feedResolveFx = ReturnType<typeof feedResolveFx>;
