import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DateTime } from "luxon";
import type { ListingEventCreateSchema } from "~/@user/listing-event/schema/ListingEventCreateSchema";
import { listingCheckIfOwnFx } from "~/app/listing/fx/listingCheckIfOwnFx";
import { listingEventRateLimitFx } from "~/app/listing-event/fx/listingEventRateLimitFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
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
			const database = yield* DatabaseContextFx;

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
});

export type listingEventCreateFx = ReturnType<typeof listingEventCreateFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<listingEventCreateFx>, UserContextFx>>;
