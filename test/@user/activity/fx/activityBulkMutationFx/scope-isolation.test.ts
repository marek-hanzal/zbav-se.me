import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";
import { activityPatchCollectionFx } from "~/user/activity/server/fx/activityPatchCollectionFx";

describe("activity bulk mutation scope isolation", () => {
	it("keeps foreign rows untouched when patching and archiving scoped rows", async () => {
		const database = await testabase("activityBulkMutationFx-scope");
		const archivedAt = new Date("2026-04-01T14:00:00.000Z");

		return Effect.gen(function* () {
			const owner = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "bulk-owner-a",
							userId: owner.id,
							reference: [
								"listing-bulk",
								"tx-a",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-a",
								transactionEntryId: "entry-a",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "bulk-stranger-a",
							userId: stranger.id,
							reference: [
								"listing-bulk",
								"tx-stranger",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-stranger",
								transactionEntryId: "entry-stranger",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:30:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			yield* activityPatchCollectionFx({
				scope: {
					userId: owner.id,
				},
				query: {
					filter: {
						reference: "listing-bulk",
						type: "buyer-message",
					},
				},
				patch: {
					archivedAt,
				},
			});
			yield* activityArchiveFx({
				scope: {
					userId: owner.id,
				},
				where: {
					reference: "listing-bulk",
				},
			});

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"id",
						"archivedAt",
					])
					.where("id", "in", [
						"bulk-owner-a",
						"bulk-stranger-a",
					])
					.execute(),
			);

			expect(rows.find((row) => row.id === "bulk-owner-a")?.archivedAt).not.toBeNull();
			expect(rows.find((row) => row.id === "bulk-stranger-a")?.archivedAt).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
