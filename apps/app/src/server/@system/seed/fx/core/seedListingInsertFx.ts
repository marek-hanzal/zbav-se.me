import { DateContextFx } from "@use-pico/common/date";
import { embedMinHash } from "@use-pico/common/embedding";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import pgvector from "pgvector";
import { match } from "ts-pattern";
import type { ListingCreateSchema } from "~/client/@seller/listing/server/schema/ListingCreateSchema";
import { galleryInsertFx } from "~/client/@user/gallery/server/fx/galleryInsertFx";
import { seedGalleryItemBulkInsertFx } from "~/server/@system/seed/fx/core/seedGalleryItemBulkInsertFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { InvalidRequestErrorFx } from "~/server/error/InvalidRequestErrorFx";

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
	const nowDate = now.toJSDate();

	const gallery = yield* galleryInsertFx({
		userId,
	});

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
				createdAt: nowDate,
				updatedAt: nowDate,
				currency: "CZK",
				status: "live",
				...data,
				titleVec: withCachedTitleVec(data.title),
				expiresAt: match(data.expiresAt)
					.with("7-days", () =>
						now
							.plus({
								days: 7,
							})
							.toJSDate(),
					)
					.with("14-days", () =>
						now
							.plus({
								days: 14,
							})
							.toJSDate(),
					)
					.with("1-month", () =>
						now
							.plus({
								months: 1,
							})
							.toJSDate(),
					)
					.exhaustive(),
			})
			.execute(),
	);

	if (data.draftId) {
		const draftId = data.draftId;
		yield* tryDbFx(async () =>
			kysely
				.updateTable("draft")
				.set({
					usedAt: nowDate,
					updatedAt: nowDate,
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
