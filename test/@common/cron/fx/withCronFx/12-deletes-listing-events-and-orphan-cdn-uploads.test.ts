import { Effect } from "effect";
import { Client } from "minio";
import { describe, expect, it, vi } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { runCronAtFx } from "./runCronAtFx";
import {
	seedListingEventCleanupScenarioFx,
	seedUploadCleanupScenarioFx,
} from "./seedCronCleanupScenarioFx";

describe("withCronFx schedule 12 cleanup", () => {
	it("deletes stale listing events and orphan CDN uploads only", async () => {
		const database = await testabase("withCronFx-cleanup-12");
		const removeObjectsMock = vi.fn();
		const originalRemoveObjects = Client.prototype.removeObjects;
		Client.prototype.removeObjects = removeObjectsMock as typeof Client.prototype.removeObjects;

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
