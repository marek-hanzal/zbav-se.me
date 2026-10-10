import { Effect } from "effect";
import { Client } from "minio";
import { describe, expect, it, vi } from "vitest";
import { stubS3Fn } from "~/test/common/fn/stubS3Fn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { runCronAtFx } from "./runCronAtFx";
import {
	seedListingEventCleanupScenarioFx,
	seedUploadCleanupScenarioFx,
} from "./seedCronCleanupScenarioFx";

describe("withCronFx schedule 12 cleanup", () => {
	it("deletes stale listing events and orphan CDN uploads only", async () => {
		const { bucket } = stubS3Fn();
		const database = await testabaseFn("withCronFx-cleanup-12");
		const removeObjectsMockFn = vi
			.spyOn(Client.prototype, "removeObjects")
			.mockResolvedValue([]);

		return Effect.gen(function* () {
			const { seller } = yield* createUsersFx({});
			const listingEventIds = yield* seedListingEventCleanupScenarioFx({
				database,
				sellerId: seller.id,
				cutoffIso: "2026-03-01T12:00:00.000Z",
			});
			const uploadIds = yield* seedUploadCleanupScenarioFx({
				database,
				cutoffIso: "2026-03-01T12:00:00.000Z",
			});

			yield* runCronAtFx({
				schedule: "12",
				now: "2026-06-01T12:00:00.000Z",
			});

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
			expect(removeObjectsMockFn).toHaveBeenCalledWith(bucket, [
				"cron/stale.jpg",
				"cron/boundary.jpg",
			]);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
