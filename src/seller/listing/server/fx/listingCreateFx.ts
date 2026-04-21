import { Effect } from "effect";
import pgvector from "pgvector";
import { match } from "ts-pattern";
import { DateContextFx } from "@/lib/common/date";
import { embedMinHash } from "@/lib/common/embedding";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { listingFetchFx } from "~/seller/listing/server/fx/listingFetchFx";
import type { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import { categoryFetchFx } from "~/user/category/server/fx/categoryFetchFx";
import { checkRestrictionFx } from "~/user/category/server/fx/checkRestrictionFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";
import { galleryItemInsertFx } from "~/user/gallery-item/server/fx/galleryItemInsertFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

export namespace listingCreateFx {
	export interface Props extends ListingCreateSchema.Type {
		userId: string;
	}
}

export const listingCreateFx = Effect.fn("listingCreateFx")(function* ({
	userId,
	uploadIds,
	categoryId,
	restriction,
	...data
}: listingCreateFx.Props) {
	const logger = yield* getLoggerFx("listingCreateFx");
	logger.trace("listingCreateFx", {
		userId,
		uploadIds,
		categoryId,
		restriction,
		...data,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const id = genId();
			const now = dateContext.now();

			if (uploadIds.length === 0) {
				return yield* new InvalidRequestErrorFx({
					message: "At least one upload is required",
				});
			}

			/**
			 * We need ensure user does not use under-level restriction
			 * on his listing.
			 */
			if (restriction) {
				const category = yield* categoryFetchFx({
					where: {
						id: categoryId,
					},
					scope: {},
				});

				yield* checkRestrictionFx({
					level: category.restriction,
					request: restriction,
				});
			}

			const gallery = yield* galleryInsertFx({
				userId,
			});

			let sort = 0;
			for (const uploadId of uploadIds) {
				yield* galleryItemInsertFx({
					galleryId: gallery.id,
					uploadId,
					sort,
					userId,
					check: false,
				});
				sort++;
			}

			yield* tryDbFx(async () =>
				kysely
					.insertInto("listing")
					.values({
						...data,
						id,
						userId,
						categoryId,
						galleryId: gallery.id,
						createdAt: now.toJSDate(),
						updatedAt: now.toJSDate(),
						currency: "CZK",
						status: "live",
						restriction,
						titleVec: pgvector.toSql(
							embedMinHash({
								value: data.title,
							}),
						),
						expiresAt: match(data.expiresAt)
							.with("7-days", () =>
								now.plus({
									days: 7,
								}),
							)
							.with("14-days", () =>
								now.plus({
									days: 14,
								}),
							)
							.with("1-month", () =>
								now.plus({
									months: 1,
								}),
							)
							.exhaustive()
							.toJSDate(),
					})
					.execute(),
			);

			if (data.draftId) {
				const draftId = data.draftId;
				yield* tryDbFx(async () =>
					kysely
						.updateTable("draft")
						.set({
							usedAt: now.toJSDate(),
							updatedAt: now.toJSDate(),
						})
						.where("id", "=", draftId)
						.where("userId", "=", userId)
						.execute(),
				);
			}

			yield* userEventCreateFx({
				userId,
				scope: "user",
				source: "listing",
				group: id,
				event: "listing.create",
				isTerminal: true,
			});

			return yield* listingFetchFx({
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

export type listingCreateFx = ReturnType<typeof listingCreateFx>;
