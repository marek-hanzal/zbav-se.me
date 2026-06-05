import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { draftFetchFx } from "~/seller/draft/server/fx/draftFetchFx";
import type { DraftCreateSchema } from "~/seller/draft/server/schema/DraftCreateSchema";
import { listingCountFx } from "~/seller/listing/server/fx/listingCountFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";
import { resourceLimitEnsureFx } from "~/user/resource-limit/server/fx/resourceLimitEnsureFx";

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
				resource: "listing.count",
				userId,
			});

			const id = genId();
			const now = dateService.now();

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
