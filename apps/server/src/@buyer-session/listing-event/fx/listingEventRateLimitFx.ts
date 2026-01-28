import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { TooManyRequests } from "~/error/TooManyRequests";
import type { ListingEventEnumSchema } from "~/@buyer-session/listing-event/schema/ListingEventEnumSchema";

export namespace listingEventRateLimitFx {
	export interface Props {
		listingId: string;
		event: ListingEventEnumSchema.Type;
		minutes?: number;
	}
}

export const listingEventRateLimitFx = Effect.fn("listingEventRateLimitFx")(function* ({
	listingId,
	event,
	minutes = 10,
}: listingEventRateLimitFx.Props) {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const listingEvent = yield* Effect.promise(async () => {
		return kysely
			.selectFrom("listing_event")
			.select("createdAt")
			.where("listingId", "=", listingId)
			.where("event", "=", event)
			.where(
				"createdAt",
				">=",
				dateContext
					.now()
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
