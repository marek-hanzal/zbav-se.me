import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingEventEnumSchema } from "~/common/listing/enum/ListingEventEnumSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { TooManyRequestsFx } from "~/server/error/TooManyRequestsFx";

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
	const logger = yield* getLoggerFx("listingEventRateLimitFx");
	logger.trace("listingEventRateLimitFx", {
		listingId,
		event,
		minutes,
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
