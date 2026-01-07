import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { listingCheckIfOwnFx } from "~/app/listing/fx/listingCheckIfOwnFx";
import { listingEventRateLimitFx } from "~/app/listing-event/fx/listingEventRateLimitFx";
import type { ListingEventCreateSchema } from "~/app/listing-event/schema/ListingEventCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace listingEventCreateFx {
	export interface Props extends ListingEventCreateSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const listingEventCreateFx = Effect.fn("listingEventCreateFx")(function* ({
	userId,
	listingId,
	event,
	createdAt,
}: listingEventCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const kysely = yield* KyselyContextFx;

			yield* listingCheckIfOwnFx({
				userId,
				listingId,
				message: "You cannot generate event on your own listing.",
			});

			yield* listingEventRateLimitFx({
				listingId,
				event,
				createdAt,
			});

			return yield* Effect.promise(async () => {
				return kysely
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
});

export type listingEventCreateFx = ReturnType<typeof listingEventCreateFx>;
