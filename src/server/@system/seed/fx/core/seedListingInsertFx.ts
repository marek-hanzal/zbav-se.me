import { Effect } from "effect";
import pgvector from "pgvector";
import { match } from "ts-pattern";
import { DateContextFx } from "@/lib/common/date";
import { embedMinHash } from "@/lib/common/embedding";
import { genId } from "@/lib/common/gen-id";
import type { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import { seedGalleryItemBulkInsertFx } from "~/server/@system/seed/fx/core/seedGalleryItemBulkInsertFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";

const titleVecCache = new Map<string, string>();

const withCachedTitleVec = (title: string) => {
	const cached = titleVecCache.get(title);
	if (cached) {
		return cached;
	}
	const next = pgvector.toSql(
		embedMinHash({
			value: title,
		}),
	);
	titleVecCache.set(title, next);
	return next;
};

export namespace seedListingInsertFx {
	export interface Props extends ListingCreateSchema.Type {
		userId: string;
	}
}

export const seedListingInsertFx = Effect.fn("seedListingInsertFx")(function* ({
	userId,
	uploadIds,
	...data
}: seedListingInsertFx.Props) {
	if (uploadIds.length === 0) {
		return yield* new InvalidRequestErrorFx({
			message: "At least one upload is required",
		});
	}

	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const id = genId();
	const now = dateContext.now();

	const gallery = yield* galleryInsertFx({
		access: "public",
		userId,
	});

	const categoryRow = yield* tryDbFx(async () =>
		kysely
			.selectFrom("category")
			.select([
				"discovery",
				"restriction",
			])
			.where("id", "=", data.categoryId)
			.executeTakeFirstOrThrow(),
	);

	const locationRow = yield* tryDbFx(async () =>
		kysely
			.selectFrom("location")
			.select("geo")
			.where("id", "=", data.locationId)
			.executeTakeFirstOrThrow(),
	);

	yield* seedGalleryItemBulkInsertFx({
		galleryId: gallery.id,
		uploadIds,
	});

	yield* tryDbFx(async () =>
		kysely
			.insertInto("listing")
			.values({
				id,
				userId,
				galleryId: gallery.id,
				createdAt: now.toJSDate(),
				updatedAt: now.toJSDate(),
				currency: "CZK",
				status: "live",
				withCategoryDiscovery: categoryRow.discovery,
				withCategoryRestriction: categoryRow.restriction,
				withLocationGeo: locationRow.geo,
				...data,
				titleVec: withCachedTitleVec(data.title),
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

	return {
		id,
	};
});

export type seedListingInsertFx = ReturnType<typeof seedListingInsertFx>;
