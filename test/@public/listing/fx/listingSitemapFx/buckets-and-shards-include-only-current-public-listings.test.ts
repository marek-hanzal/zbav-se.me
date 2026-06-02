import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withListingBucketsFx } from "~/public/listing/server/fx/withListingBucketsFx";
import { withListingShardsFx } from "~/public/listing/server/fx/withListingShardsFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("public listing sitemap helpers", () => {
	it("buckets and shards include only current public listings", async () => {
		const database = await testabase("listing-sitemap-buckets-shards");
		const now = DateTime.fromISO("2026-05-20T12:00:00.000Z", {
			zone: "utc",
		});

		return Effect.gen(function* () {
			const { seller } = yield* createUsersFx({});
			const first = yield* createListingFx(seller.id, {
				title: "Shard first",
			});
			const second = yield* createListingFx(seller.id, {
				title: "Shard second",
			});
			const expired = yield* createListingFx(seller.id, {
				title: "Shard expired",
			});
			const future = yield* createListingFx(seller.id, {
				title: "Shard future",
			});

			for (const listing of [
				{
					id: first.id,
					visibleAt: new Date("2026-05-19T10:00:00.000Z"),
					expiresAt: new Date("2026-05-21T10:00:00.000Z"),
					updatedAt: new Date("2026-05-19T10:30:00.000Z"),
				},
				{
					id: second.id,
					visibleAt: new Date("2026-05-19T11:00:00.000Z"),
					expiresAt: new Date("2026-05-21T11:00:00.000Z"),
					updatedAt: new Date("2026-05-19T11:30:00.000Z"),
				},
				{
					id: expired.id,
					visibleAt: new Date("2026-05-19T12:00:00.000Z"),
					expiresAt: new Date("2026-05-20T11:00:00.000Z"),
					updatedAt: new Date("2026-05-19T12:30:00.000Z"),
				},
				{
					id: future.id,
					visibleAt: new Date("2026-05-20T13:00:00.000Z"),
					expiresAt: new Date("2026-05-21T13:00:00.000Z"),
					updatedAt: new Date("2026-05-20T13:30:00.000Z"),
				},
			]) {
				yield* Effect.promise(() =>
					database.kysely
						.updateTable("listing")
						.set({
							visibleAt: listing.visibleAt,
							expiresAt: listing.expiresAt,
							updatedAt: listing.updatedAt,
						})
						.where("id", "=", listing.id)
						.execute(),
				);
			}

			const buckets = yield* withListingBucketsFx({
				now,
			});
			const filteredBuckets = yield* withListingBucketsFx({
				now,
				day: "2026-05-19",
			});
			const shards = yield* withListingShardsFx({
				now,
				day: "2026-05-19",
				page: 1,
			});

			const targetBucket = buckets.find((bucket) => bucket.day === "2026-05-19");

			expect(targetBucket).toMatchObject({
				day: "2026-05-19",
				count: 2,
				pages: 1,
			});
			expect(filteredBuckets).toEqual([
				expect.objectContaining({
					day: "2026-05-19",
					count: 2,
					pages: 1,
				}),
			]);
			expect(shards.map((listing) => listing.id)).toEqual([
				second.id,
				first.id,
			]);
			expect(shards.map((listing) => listing.id)).not.toContain(expired.id);
			expect(shards.map((listing) => listing.id)).not.toContain(future.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
