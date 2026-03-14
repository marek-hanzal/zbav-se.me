import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@buyer/listing/fx/listingCheckIfOwnFx";
import { listingEventRateLimitFx } from "~/@buyer/listing-event/fx/listingEventRateLimitFx";
import type { ListingEventCreateSchema } from "~/@buyer/listing-event/schema/ListingEventCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace listingEventCreateFx {
	export interface Props extends ListingEventCreateSchema.Type {
		userId: string;
	}
}

export const listingEventCreateFx = Effect.fn("listingEventCreateFx")(function* ({
	userId,
	listingId,
	event,
}: listingEventCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			yield* listingCheckIfOwnFx({
				userId,
				listingId,
				message: "You cannot generate event on your own listing.",
			});

			const now = dateContext.now();

			yield* listingEventRateLimitFx({
				listingId,
				event,
			});

			return yield* tryDbFx(async () =>
				kysely
					.insertInto("listing_event")
					.values({
						id: genId(),
						listingId,
						event,
						createdAt: now.toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow(),
			);
		}),
	);
});

export type listingEventCreateFx = ReturnType<typeof listingEventCreateFx>;
