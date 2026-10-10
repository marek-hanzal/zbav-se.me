import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/buyer-listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/buyer-listing/fx/listingFetchFx";
import { listingEventRateLimitFx } from "~/buyer-listing-event/fx/listingEventRateLimitFx";
import type { ListingEventCreateSchema } from "~/buyer-listing-event/schema/ListingEventCreateSchema";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace listingEventCreateFx {
	export interface Props extends ListingEventCreateSchema.Type {
		userId: string;
		checkVisibility?: boolean;
	}
}

export const listingEventCreateFx = Effect.fn("listingEventCreateFx")(function* ({
	userId,
	listingId,
	event,
	checkVisibility = true,
}: listingEventCreateFx.Props) {
	const logger = yield* getLoggerFx("listingEventCreateFx");
	logger.trace("listingEventCreateFx", {
		userId,
		listingId,
		event,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateService = yield* DateServiceFx;

			yield* listingCheckIfOwnFx({
				userId,
				listingId,
				message: "You cannot generate event on your own listing.",
			});

			if (checkVisibility) {
				yield* listingFetchFx({
					userId,
					where: {
						id: listingId,
					},
					scope: {},
				});
			}

			const now = dateService.nowFn();

			yield* listingEventRateLimitFx({
				listingId,
				event,
			});

			return yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("listing_event")
					.values({
						id: genIdFn(),
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
