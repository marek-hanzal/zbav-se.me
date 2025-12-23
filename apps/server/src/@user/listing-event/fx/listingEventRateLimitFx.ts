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
	}
}

export const listingEventRateLimitFx = ({
	listingId,
	event,
	minutes = 10,
}: listingEventRateLimitFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const listingEvent = yield* Effect.tryPromise(async () => {
			return database
				.selectFrom("listing_event")
				.select("createdAt")
				.where("listingId", "=", listingId)
				.where("event", "=", event)
				.where(
					"createdAt",
					">=",
					DateTime.now()
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
};

export type listingEventRateLimitFx = ReturnType<typeof listingEventRateLimitFx>;
