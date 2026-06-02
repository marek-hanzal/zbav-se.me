import { Effect } from "effect";
import { Client } from "minio";
import { describe, expect, it, vi } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { runCronAtFx } from "./runCronAtFx";
import {
	seedCategoryMissCleanupScenarioFx,
	seedListingEventCleanupScenarioFx,
	seedUploadCleanupScenarioFx,
} from "./seedCronCleanupScenarioFx";

describe("withCronFx schedule 20 cleanup", () => {
	it("deletes stale category misses, listing events and orphan CDN uploads only", async () => {
		const database = await testabase("withCronFx-cleanup-20");
		const removeObjectsMock = vi.fn();
		const originalRemoveObjects = Client.prototype.removeObjects;
		Client.prototype.removeObjects = removeObjectsMock as typeof Client.prototype.removeObjects;

		return Effect.gen(function* () {
			const { seller } = yield* createUsersFx({});
			const categoryMissIds = yield* seedCategoryMissCleanupScenarioFx({
				database,
				cutoffIso: "2026-05-25T20:00:00.000Z",
			});
			const listingEventIds = yield* seedListingEventCleanupScenarioFx({
				database,
				sellerId: seller.id,
				cutoffIso: "2026-03-01T20:00:00.000Z",
			});
			const uploadIds = yield* seedUploadCleanupScenarioFx({
				database,
				cutoffIso: "2026-03-01T20:00:00.000Z",
			});

			yield* runCronAtFx({
				schedule: "20",
				now: "2026-06-01T20:00:00.000Z",
			});

			const categoryMisses = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("category_miss")
					.select("id")
					.where("id", "in", Object.values(categoryMissIds))
					.execute(),
			);
			const listingEvents = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select("id")
					.where("id", "in", Object.values(listingEventIds))
					.execute(),
			);
			const uploads = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("upload")
					.select("id")
					.where("id", "in", Object.values(uploadIds))
					.execute(),
			);

			expect(categoryMisses.map(({ id }) => id)).toEqual([
				categoryMissIds.fresh,
			]);
			expect(listingEvents.map(({ id }) => id)).toEqual([
				listingEventIds.fresh,
			]);
			expect(uploads.map(({ id }) => id)).toEqual(
				expect.arrayContaining([
					uploadIds.external,
					uploadIds.feed,
					uploadIds.fresh,
					uploadIds.gallery,
				]),
			);
			expect(uploads).toHaveLength(4);
			expect(removeObjectsMock).toHaveBeenCalledWith("zbav-se-me-upload", [
				"cron/stale.jpg",
				"cron/boundary.jpg",
			]);
		}).pipe(
			Effect.ensuring(
				Effect.sync(() => {
					Client.prototype.removeObjects = originalRemoveObjects;
				}),
			),
			withRuntimeFx(database),
			Effect.runPromise,
		);
	});
});
