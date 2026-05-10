import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { draftDeleteFx } from "~/seller/draft/server/fx/draftDeleteFx";
import { draftFetchFx } from "~/seller/draft/server/fx/draftFetchFx";
import type { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import { listingSpotlightBuildFx } from "~/server/listing-spotlight/server/fx/listingSpotlightBuildFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";
import { galleryItemInsertFx } from "~/user/gallery-item/server/fx/galleryItemInsertFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";
import { listingFetchFx } from "./listingFetchFx";
import { listingValidateFx } from "./listingValidateFx";

export namespace listingCreateFx {
	export interface Props extends ListingCreateSchema.Type {
		userId: string;
	}
}

export const listingCreateFx = Effect.fn("listingCreateFx")(function* ({
	userId,
	draftId,
}: listingCreateFx.Props) {
	const logger = yield* getLoggerFx("listingCreateFx");
	logger.trace("listingCreateFx", {
		userId,
		draftId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const draft = yield* draftFetchFx({
				userId,
				where: {
					id: draftId,
				},
				scope: {
					userId,
				},
			});

			const validation = yield* listingValidateFx({
				userId,
				draftId,
			});

			if (!validation.success) {
				return yield* new InvalidRequestErrorFx({
					message: validation.errors.map((item) => item.message).join(", "),
				});
			}

			/**
			 * Here we're only going to make TypeScript happy
			 */
			if (
				!draft.title ||
				!draft.categoryId ||
				!draft.locationId ||
				!draft.priceType ||
				!draft.expires
			) {
				return yield* new InvalidRequestErrorFx({
					message: "Draft is missing required data for publish.",
				});
			}

			const { title, categoryId, locationId, priceType, expires } = draft;
			const now = dateContext.now();
			const listingId = genId();

			const gallery = yield* galleryInsertFx({
				access: "public",
				userId,
			});

			const { geo: withLocation } = yield* tryDbFx(async () => {
				return kysely
					.selectFrom("location")
					.select("geo")
					.where("id", "=", locationId)
					.executeTakeFirstOrThrow();
			});

			const withUploadIds: string[] = [];

			for (const [sort, url] of draft.withImageUrl.entries()) {
				const upload = yield* uploadCreateFx({
					userId,
					access: "public",
					url,
				});

				withUploadIds.push(upload.id);

				yield* galleryItemInsertFx({
					galleryId: gallery.id,
					uploadId: upload.id,
					sort,
					userId,
					check: false,
				});
			}

			yield* tryDbFx(async () => {
				return kysely
					.insertInto("listing")
					.values({
						id: listingId,
						userId,
						status: "live",
						restriction: draft.restriction,
						categoryId,
						galleryId: gallery.id,
						withUploadIds: withUploadIds as [
							string,
							...string[],
						],
						withImageUrl: draft.withImageUrl as [
							string,
							...string[],
						],
						title,
						withTitle: sql`lower(immutable_unaccent(${title}))`,
						description: draft.description,
						priceType,
						price: draft.price,
						currency: draft.currency,
						expires,
						condition: draft.condition,
						age: draft.age,
						delivery: draft.delivery,
						warranty: draft.warranty,
						//
						locationId,
						withLocation,
						//
						pros: draft.pros,
						cons: draft.cons,
						//
						createdAt: now.toJSDate(),
						updatedAt: now.toJSDate(),
						visibleAt: now.toJSDate(),
						expiresAt: match(expires)
							.with("7-days", () => {
								return now.plus({
									days: 7,
								});
							})
							.with("14-days", () => {
								return now.plus({
									days: 14,
								});
							})
							.with("1-month", () => {
								return now.plus({
									month: 1,
								});
							})
							.exhaustive()
							.toJSDate(),
					})
					.execute();
			});

			{
				const draftAttrDecimal = yield* tryDbFx(async () => {
					return kysely
						.selectFrom("draft_attr_decimal")
						.selectAll()
						.where("draftId", "=", draftId)
						.execute();
				});

				if (draftAttrDecimal.length > 0) {
					yield* tryDbFx(async () => {
						return kysely
							.insertInto("listing_attr_decimal")
							.values(
								draftAttrDecimal.map((item) => ({
									listingId,
									fieldId: item.fieldId,
									value: item.value,
								})),
							)
							.execute();
					});
				}

				const draftAttrNumber = yield* tryDbFx(async () => {
					return kysely
						.selectFrom("draft_attr_number")
						.selectAll()
						.where("draftId", "=", draftId)
						.execute();
				});

				if (draftAttrNumber.length > 0) {
					yield* tryDbFx(async () => {
						return kysely
							.insertInto("listing_attr_number")
							.values(
								draftAttrNumber.map((item) => ({
									listingId,
									fieldId: item.fieldId,
									value: item.value,
								})),
							)
							.execute();
					});
				}

				const draftAttrEnumSingle = yield* tryDbFx(async () => {
					return kysely
						.selectFrom("draft_attr_enum_single")
						.selectAll()
						.where("draftId", "=", draftId)
						.execute();
				});

				if (draftAttrEnumSingle.length > 0) {
					yield* tryDbFx(async () => {
						return kysely
							.insertInto("listing_attr_enum_single")
							.values(
								draftAttrEnumSingle.map((item) => ({
									listingId,
									fieldId: item.fieldId,
									value: item.value,
								})),
							)
							.execute();
					});
				}

				const draftAttrEnumMulti = yield* tryDbFx(async () => {
					return kysely
						.selectFrom("draft_attr_enum_multi")
						.selectAll()
						.where("draftId", "=", draftId)
						.execute();
				});

				if (draftAttrEnumMulti.length > 0) {
					yield* tryDbFx(async () => {
						return kysely
							.insertInto("listing_attr_enum_multi")
							.values(
								draftAttrEnumMulti.map((item) => ({
									listingId,
									fieldId: item.fieldId,
									value: item.value,
								})),
							)
							.execute();
					});
				}

				const draftAttrText = yield* tryDbFx(async () => {
					return kysely
						.selectFrom("draft_attr_text")
						.selectAll()
						.where("draftId", "=", draftId)
						.execute();
				});

				if (draftAttrText.length > 0) {
					yield* tryDbFx(async () => {
						return kysely
							.insertInto("listing_attr_text")
							.values(
								draftAttrText.map((item) => ({
									listingId,
									fieldId: item.fieldId,
									value: item.value,
								})),
							)
							.execute();
					});
				}
			}

			yield* listingSpotlightBuildFx({
				listingId,
			});

			yield* userEventCreateFx({
				userId,
				scope: "user",
				source: "listing",
				group: listingId,
				event: "listing.create",
				isTerminal: true,
			});

			yield* draftDeleteFx({
				userId,
				where: {
					id: draftId,
				},
				scope: {
					userId,
				},
			});

			return yield* listingFetchFx({
				userId,
				where: {
					id: listingId,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type listingCreateFx = ReturnType<typeof listingCreateFx>;
