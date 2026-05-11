import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingEventEnumSchema } from "~/common/listing/enum/ListingEventEnumSchema";
import { rateLimitCheckFx } from "~/server/rate-limit/server/fx/rateLimitCheckFx";

const LISTING_EVENT_RATE_LIMIT_RULE = "listing-event";

export namespace listingEventRateLimitFx {
	export interface Props {
		listingId: string;
		event: ListingEventEnumSchema.Type;
	}
}

export const listingEventRateLimitFx = Effect.fn("listingEventRateLimitFx")(function* ({
	listingId,
	event,
}: listingEventRateLimitFx.Props) {
	const logger = yield* getLoggerFx("listingEventRateLimitFx");
	logger.trace("listingEventRateLimitFx", {
		listingId,
		event,
	});

	yield* rateLimitCheckFx({
		rule: LISTING_EVENT_RATE_LIMIT_RULE,
		key: [
			listingId,
			event,
		],
		message: "You have already created this event",
	});

	return yield* Effect.void;
});

export type listingEventRateLimitFx = ReturnType<typeof listingEventRateLimitFx>;
