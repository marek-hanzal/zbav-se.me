import { Effect } from "effect";
import { withFeedSelectFx } from "~/buyer-feed/db/withFeedSelectFx";
import type { FeedCountQuerySchema } from "~/buyer-feed/schema/FeedCountQuerySchema";
import type { FeedWhereSchema } from "~/buyer-feed/schema/FeedWhereSchema";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

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
