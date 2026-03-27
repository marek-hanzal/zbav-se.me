import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/client/@buyer/listing/server/fx/listingCheckIfOwnFx";
import { listingEventRateLimitFx } from "~/client/@buyer/listing-event/server/fx/listingEventRateLimitFx";
import type { ListingEventCreateSchema } from "~/client/@buyer/listing-event/server/schema/ListingEventCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

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
