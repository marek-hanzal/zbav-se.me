import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { listingCheckIfOwnFx } from "~/@user/listing/fx/listingCheckIfOwnFx";
import { listingEventRateLimitFx } from "~/@user/listing-event/fx/listingEventRateLimitFx";
import type { ListingEventCreateSchema } from "~/@user/listing-event/schema/ListingEventCreateSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace listingEventCreateFx {
	export interface Props extends ListingEventCreateSchema.Type {
		createdAt?: DateTime;
	}
}

export const listingEventCreateFx = ({
	listingId,
	event,
	createdAt,
}: listingEventCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			yield* listingCheckIfOwnFx({
				listingId,
				message: "You cannot generate event on your own listing.",
			});

			yield* listingEventRateLimitFx({
				listingId,
				event,
				createdAt,
			});

			return yield* Effect.tryPromise(async () => {
				return database
					.insertInto("listing_event")
					.values({
						id: genId(),
						listingId,
						event,
						createdAt: (createdAt ?? DateTime.now()).toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});
		}),
	);
};

export type listingEventCreateFx = ReturnType<typeof listingEventCreateFx>;
