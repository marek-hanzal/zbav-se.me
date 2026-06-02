import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withFeedSelectFx } from "~/buyer/feed/server/db/withFeedSelectFx";
import type { FeedCountQuerySchema } from "~/buyer/feed/server/schema/FeedCountQuerySchema";
import type { FeedWhereSchema } from "../schema/FeedWhereSchema";

export namespace feedCountFx {
	export interface Props extends FeedCountQuerySchema.Type {
		scope: FeedWhereSchema.Type;
	}
}

export const feedCountFx = Effect.fn("feedCountFx")(function* ({
	where,
	scope,
}: feedCountFx.Props) {
	const logger = yield* getLoggerFx("feedCountFx");
	logger.trace("feedCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withFeedSelectFx({}),
		where,
		scope,
	});
});

export type feedCountFx = ReturnType<typeof feedCountFx>;
