import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { listingCheckIfOwnFx } from "~/buyer/listing/server/fx/listingCheckIfOwnFx";
import { listingFetchFx } from "~/buyer/listing/server/fx/listingFetchFx";
import { listingEventCreateFx } from "~/buyer/listing-event/server/fx/listingEventCreateFx";
import type { ThumbCreateSchema } from "~/buyer/thumb/server/schema/ThumbCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { inboxCreateFx } from "~/user/inbox/server/fx/inboxCreateFx";

export namespace thumbCreateFx {
	export interface Props extends ThumbCreateSchema.Type {
		userId: string;
	}
}

export const thumbCreateFx = Effect.fn("thumbCreateFx")(function* ({
	userId,
	listingId,
	type,
	...data
}: thumbCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();

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

			yield* listingEventCreateFx({
				userId,
				listingId,
				event: type,
			}).pipe(Effect.ignore);

			yield* tryDbFx(async () =>
				kysely
					.insertInto("thumb")
					.values({
						...data,
						id,
						userId,
						listingId,
						type,
						createdAt: dateContext.now().toJSDate(),
					})
					.onConflict((eb) => eb.doNothing())
					.returningAll()
					.executeTakeFirstOrThrow(),
			);

			yield* inboxCreateFx({
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
			});
		}),
	);
});

export type thumbCreateFx = ReturnType<typeof thumbCreateFx>;
