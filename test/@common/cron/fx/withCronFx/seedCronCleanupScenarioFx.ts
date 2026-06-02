import { Effect } from "effect";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import type { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

export namespace seedCategoryMissCleanupScenarioFx {
	export interface Props {
		cutoffIso: string;
		database: TestDatabase;
	}
}

export const seedCategoryMissCleanupScenarioFx = ({
	cutoffIso,
	database,
}: seedCategoryMissCleanupScenarioFx.Props) =>
	Effect.gen(function* () {
		const cutoff = new Date(cutoffIso);
		const ids = {
			stale: "cron-category-miss-stale",
			boundary: "cron-category-miss-boundary",
			fresh: "cron-category-miss-fresh",
		} as const;

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("category_miss")
				.values([
					{
						id: ids.stale,
						category: "stale",
						count: 1,
						updatedAt: new Date(cutoff.getTime() - 1_000),
					},
					{
						id: ids.boundary,
						category: "boundary",
						count: 1,
						updatedAt: cutoff,
					},
					{
						id: ids.fresh,
						category: "fresh",
						count: 1,
						updatedAt: new Date(cutoff.getTime() + 1_000),
					},
				])
				.execute(),
		);

		return ids;
	});

export namespace seedListingEventCleanupScenarioFx {
	export interface Props {
		cutoffIso: string;
		database: TestDatabase;
		sellerId: string;
	}
}

export const seedListingEventCleanupScenarioFx = ({
	cutoffIso,
	database,
	sellerId,
}: seedListingEventCleanupScenarioFx.Props) =>
	Effect.gen(function* () {
		const cutoff = new Date(cutoffIso);
		const listing = yield* createListingFx(sellerId, {
			title: "Cron listing event cleanup",
		});
		const ids = {
			stale: "cron-listing-event-stale",
			boundary: "cron-listing-event-boundary",
			fresh: "cron-listing-event-fresh",
		} as const;

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("listing_event")
				.values([
					{
						id: ids.stale,
						listingId: listing.id,
						event: "view",
						createdAt: new Date(cutoff.getTime() - 1_000),
					},
					{
						id: ids.boundary,
						listingId: listing.id,
						event: "view",
						createdAt: cutoff,
					},
					{
						id: ids.fresh,
						listingId: listing.id,
						event: "view",
						createdAt: new Date(cutoff.getTime() + 1_000),
					},
				])
				.execute(),
		);

		return ids;
	});

export namespace seedUserEventCleanupScenarioFx {
	export interface Props {
		cutoffIso: string;
		database: TestDatabase;
		userId: string;
	}
}

export const seedUserEventCleanupScenarioFx = ({
	cutoffIso,
	database,
	userId,
}: seedUserEventCleanupScenarioFx.Props) =>
	Effect.gen(function* () {
		const cutoff = new Date(cutoffIso);
		const ids = {
			stale: "cron-user-event-stale",
			boundary: "cron-user-event-boundary",
			fresh: "cron-user-event-fresh",
		} as const;

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("user_event")
				.values([
					{
						id: ids.stale,
						userId,
						scope: "user",
						source: "listing",
						group: "cron-user-event-stale",
						event: "like",
						isTerminal: false,
						createdAt: new Date(cutoff.getTime() - 1_000),
					},
					{
						id: ids.boundary,
						userId,
						scope: "user",
						source: "listing",
						group: "cron-user-event-boundary",
						event: "like",
						isTerminal: false,
						createdAt: cutoff,
					},
					{
						id: ids.fresh,
						userId,
						scope: "user",
						source: "listing",
						group: "cron-user-event-fresh",
						event: "like",
						isTerminal: false,
						createdAt: new Date(cutoff.getTime() + 1_000),
					},
				])
				.execute(),
		);

		return ids;
	});

export namespace seedUploadCleanupScenarioFx {
	export interface Props {
		cutoffIso: string;
		database: TestDatabase;
	}
}

export const seedUploadCleanupScenarioFx = ({
	cutoffIso,
	database,
}: seedUploadCleanupScenarioFx.Props) =>
	Effect.gen(function* () {
		const cutoff = new Date(cutoffIso);
		const { seller } = yield* createUsersFx({});
		const ids = {
			stale: "cron-upload-stale",
			boundary: "cron-upload-boundary",
			fresh: "cron-upload-fresh",
			external: "cron-upload-external",
			gallery: "cron-upload-gallery",
			feed: "cron-upload-feed",
		} as const;

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("upload")
				.values([
					{
						id: ids.stale,
						userId: seller.id,
						url: testUploadUrl("cron/stale.jpg"),
						access: "public",
						createdAt: new Date(cutoff.getTime() - 1_000),
					},
					{
						id: ids.boundary,
						userId: seller.id,
						url: testUploadUrl("cron/boundary.jpg"),
						access: "public",
						createdAt: cutoff,
					},
					{
						id: ids.fresh,
						userId: seller.id,
						url: testUploadUrl("cron/fresh.jpg"),
						access: "public",
						createdAt: new Date(cutoff.getTime() + 1_000),
					},
					{
						id: ids.external,
						userId: seller.id,
						url: "https://example.com/cron/external.jpg",
						access: "public",
						createdAt: new Date(cutoff.getTime() - 1_000),
					},
					{
						id: ids.gallery,
						userId: seller.id,
						url: testUploadUrl("cron/gallery.jpg"),
						access: "public",
						createdAt: new Date(cutoff.getTime() - 1_000),
					},
					{
						id: ids.feed,
						userId: seller.id,
						url: testUploadUrl("cron/feed.jpg"),
						access: "public",
						createdAt: new Date(cutoff.getTime() - 1_000),
					},
				])
				.execute(),
		);

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("gallery")
				.values({
					id: "cron-upload-gallery-container",
					userId: seller.id,
					access: "public",
					createdAt: new Date(cutoff.getTime() - 1_000),
				})
				.execute(),
		);

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("gallery_item")
				.values({
					id: "cron-upload-gallery-item",
					galleryId: "cron-upload-gallery-container",
					uploadId: ids.gallery,
					sort: 0,
					createdAt: new Date(cutoff.getTime() - 1_000),
				})
				.execute(),
		);

		yield* Effect.promise(() =>
			database.kysely
				.insertInto("feed")
				.values({
					id: "cron-upload-feed-container",
					userId: seller.id,
					uploadId: ids.feed,
					type: "user",
					name: "Cron upload feed",
					query: JSON.stringify({}) as never,
					createdAt: new Date(cutoff.getTime() - 1_000),
					updatedAt: new Date(cutoff.getTime() - 1_000),
				})
				.execute(),
		);

		return ids;
	});
