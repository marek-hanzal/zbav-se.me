import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/@buyer-session/listing/fx/listingCheckIfOwnFx";
import { listingEventRateLimitFx } from "~/@buyer-session/listing-event/fx/listingEventRateLimitFx";
import type { ListingEventCreateSchema } from "~/@buyer-session/listing-event/schema/ListingEventCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "listingEventCreateFx",
		input: {
			userId,
			listingId,
			event,
		},
	});

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

			return yield* Effect.promise(async () => {
				return kysely
					.insertInto("listing_event")
					.values({
						id: genId(),
						listingId,
						event,
						createdAt: now.toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});
		}),
	);
});

export type listingEventCreateFx = ReturnType<typeof listingEventCreateFx>;
