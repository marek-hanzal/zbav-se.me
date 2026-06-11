import { Effect } from "effect";
import { Client } from "minio";
import { describe, expect, it, vi } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { runCronAtFx } from "./runCronAtFx";
import {
	seedCategoryMissCleanupScenarioFx,
	seedUploadCleanupScenarioFx,
	seedUserEventCleanupScenarioFx,
} from "./seedCronCleanupScenarioFx";

describe("withCronFx schedule 08 cleanup", () => {
	it("deletes stale category misses, user events and orphan CDN uploads only", async () => {
		const database = await testabase("withCronFx-cleanup-08");
		const removeObjectsMock = vi.fn();
		const originalRemoveObjects = Client.prototype.removeObjects;
		Client.prototype.removeObjects = removeObjectsMock as typeof Client.prototype.removeObjects;

		return Effect.gen(function* () {
			const categoryMissIds = yield* seedCategoryMissCleanupScenarioFx({
				database,
				cutoffIso: "2026-05-25T08:00:00.000Z",
			});
			const uploadIds = yield* seedUploadCleanupScenarioFx({
				database,
				cutoffIso: "2026-03-01T08:00:00.000Z",
			});

			const user = yield* Effect.promise(() =>
				database.kysely.selectFrom("user").select("id").limit(1).executeTakeFirstOrThrow(),
			);
			const userEventIds = yield* seedUserEventCleanupScenarioFx({
				database,
				userId: user.id,
				cutoffIso: "2025-12-01T08:00:00.000Z",
			});

			yield* runCronAtFx({
				schedule: "08",
				now: "2026-06-01T08:00:00.000Z",
			});

			const categoryMisses = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("category_miss")
					.select("id")
					.where("id", "in", Object.values(categoryMissIds))
					.execute(),
			);
			const userEvents = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("user_event")
					.select("id")
					.where("id", "in", Object.values(userEventIds))
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
			expect(userEvents.map(({ id }) => id)).toEqual([
				userEventIds.fresh,
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
