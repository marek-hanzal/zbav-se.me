import { Effect } from "effect";
import { listingCheckIfOwnFx } from "~/buyer-listing/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/buyer-listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/buyer-listing-event/fx/listingEventCreateFx";
import type { ThumbCreateSchema } from "~/buyer-thumb/schema/ThumbCreateSchema";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { activityCreateFx } from "~/user-activity/fx/activityCreateFx";

export namespace thumbCreateFx {
	export interface Props extends ThumbCreateSchema.Type {
		userId: string;
	}
}

export const thumbCreateFx = Effect.fn("thumbCreateFx")(function* ({
	userId,
	listingId,
	type,
	meta,
	...data
}: thumbCreateFx.Props) {
	const logger = yield* getLoggerFx("thumbCreateFx");
	logger.trace("thumbCreateFx", {
		userId,
		listingId,
		type,
		meta,
		...data,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateServiceFx;

			const id = genIdFn();

			yield* listingCheckIfOwnFx({
				userId,
				listingId,
				message: "You cannot provide thumb on your own listing.",
			});

			const listing = yield* listingFetchFx({
				userId,
				where: {
					id: listingId,
				},
				scope: {},
			});

			const thumb = yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("thumb")
					.values({
						...data,
						id,
						userId,
						listingId,
						type,
						createdAt: dateContext.nowFn().toJSDate(),
					})
					.onConflict((eb) => eb.doNothing())
					.returningAll()
					.executeTakeFirst();
			});

			if (thumb) {
				yield* listingEventCreateFx({
					userId,
					listingId,
					event: type,
					checkVisibility: false,
				}).pipe(Effect.ignore);

				yield* activityCreateFx({
					userId: listing.userId,
					reference: [
						listingId,
					],
					family: "reaction",
					type: "thumb",
					payload: {
						listingId,
						thumb: type,
					},
					priority: "common",
				});
			}

			/**
			 * It's intentional, because listing has a lot of user-related
			 * data, e.g. if it has thumb and so on, so we need to fetch fresh
			 * listing.
			 */
			return yield* listingFetchFx({
				userId,
				where: {
					id: listingId,
				},
				scope: {},
				meta,
			});
		}),
	);
});

export type thumbCreateFx = ReturnType<typeof thumbCreateFx>;
