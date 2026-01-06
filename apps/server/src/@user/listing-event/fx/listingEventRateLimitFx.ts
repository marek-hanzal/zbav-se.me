import { Effect } from "effect";
import { DateTime } from "luxon";
import type { ListingEventEnumSchema } from "~/app/listing-event/schema/ListingEventEnumSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { TooManyRequests } from "~/error/TooManyRequests";

export namespace listingEventRateLimitFx {
	export interface Props {
		listingId: string;
		event: ListingEventEnumSchema.Type;
		minutes?: number;
		createdAt?: DateTime;
	}
}

export const listingEventRateLimitFx = Effect.fn("listingEventRateLimitFx")(function* ({
	listingId,
	event,
	minutes = 10,
	createdAt,
}: listingEventRateLimitFx.Props) {
	const database = yield* DatabaseContextFx;

	const listingEvent = yield* Effect.promise(async () => {
		return database
			.selectFrom("listing_event")
			.select("createdAt")
			.where("listingId", "=", listingId)
			.where("event", "=", event)
			.where(
				"createdAt",
				">=",
				(createdAt ?? DateTime.now())
					.minus({
						minutes,
					})
					.toJSDate(),
			)
			.orderBy("createdAt", "desc")
			.executeTakeFirst();
	});

	if (listingEvent) {
		return yield* new TooManyRequests({
			message: "You have already created this event",
		});
	}

	return yield* Effect.void;
});

export type listingEventRateLimitFx = ReturnType<typeof listingEventRateLimitFx>;
