import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { draftFetchFx } from "~/seller-draft/fx/draftFetchFx";
import type { DraftCreateSchema } from "~/seller-draft/schema/DraftCreateSchema";
import { listingCountFx } from "~/seller-listing/fx/listingCountFx";
import { galleryInsertFx } from "~/user-gallery/fx/galleryInsertFx";
import { resourceLimitEnsureFx } from "~/user-resource-limit/fx/resourceLimitEnsureFx";

export namespace draftCreateFx {
	export interface Props extends DraftCreateSchema.Type {
		userId: string;
	}
}

export const draftCreateFx = Effect.fn("draftCreateFx")(function* ({
	userId,
	...data
}: draftCreateFx.Props) {
	const logger = yield* getLoggerFx("draftCreateFx");
	logger.trace("draftCreateFx", {
		userId,
		...data,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateService = yield* DateServiceFx;
			const liveListingCount = yield* listingCountFx({
				userId,
				where: {
					status: "live",
				},
				scope: {
					userId,
				},
			});

			yield* resourceLimitEnsureFx({
				count: liveListingCount + 1,
				resource: "seller:limit:listing.count",
				userId,
			});

			const id = genIdFn();
			const now = dateService.nowFn();

			const gallery = yield* galleryInsertFx({
				access: "public",
				userId,
			});

			yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("draft")
					.values({
						...data,
						id,
						userId,
						price: 0,
						//
						galleryId: gallery.id,
						withImageUrl: [],
						withUploadIds: [],
						//
						delivery: [],
						//
						cons: [],
						pros: [],
						//
						createdAt: now.toJSDate(),
						updatedAt: now.toJSDate(),
					})
					.execute();
			});

			return yield* draftFetchFx({
				userId,
				where: {
					id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type draftCreateFx = ReturnType<typeof draftCreateFx>;
