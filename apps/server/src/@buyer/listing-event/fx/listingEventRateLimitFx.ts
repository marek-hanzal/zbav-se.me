import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import type { ListingEventEnumSchema } from "~/database/@enum/ListingEventEnumSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { traceLogFx } from "~/effect/traceLogFx";
import { TooManyRequestsFx } from "~/error/TooManyRequestsFx";

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
	yield* traceLogFx({
		level: "trace",
		message: "listingEventRateLimitFx",
		input: {
			listingId,
			event,
			minutes,
		},
	});

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const listingEvent = yield* tryDbFx(async () =>
		kysely
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
			.executeTakeFirst(),
	);

	if (listingEvent) {
		return yield* new TooManyRequestsFx({
			message: "You have already created this event",
		});
	}

	return yield* Effect.void;
});

export type listingEventRateLimitFx = ReturnType<typeof listingEventRateLimitFx>;
