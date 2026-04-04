import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { inboxArchiveFx } from "~/user/inbox/server/fx/inboxArchiveFx";
import { inboxCountFx } from "~/user/inbox/server/fx/inboxCountFx";

describe("inbox bulk mutation archive contract", () => {
	it("archives only scoped rows matched by reference filters and keeps counts consistent", async () => {
		const database = await testabase("inboxBulkMutationFx-archive");

		return Effect.gen(function* () {
			const owner = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("inbox")
					.values([
						{
							id: "bulk-owner-c",
							userId: owner.id,
							reference: [
								"listing-bulk",
								"tx-c",
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: "tx-c",
								transactionEntryId: "entry-c",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T11:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "bulk-owner-reaction",
							userId: owner.id,
							reference: [
								"listing-bulk",
							],
							family: "reaction",
							type: "thumb",
							payload: {
								listingId: "listing-bulk",
								thumb: "like",
							},
							priority: "common",
							timestamp: new Date("2026-04-01T12:00:00.000Z"),
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

			yield* inboxArchiveFx({
				scope: {
					userId: owner.id,
				},
				where: {
					family: "transaction",
					referenceIn: [
						"tx-c",
						"tx-stranger",
					],
				},
			});

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select([
						"id",
						"userId",
						"archivedAt",
					])
					.where("id", "in", [
						"bulk-owner-c",
						"bulk-owner-reaction",
						"bulk-stranger-a",
					])
					.execute(),
			);

			const archivedIds = rows
				.filter((row) => row.archivedAt !== null)
				.map((row) => row.id)
				.sort();

			expect(archivedIds).toEqual([
				"bulk-owner-c",
			]);

			const ownerActive = yield* inboxCountFx({
				scope: {
					userId: owner.id,
				},
				where: {
					archivedAtIsNull: true,
				},
			});
			const strangerActive = yield* inboxCountFx({
				scope: {
					userId: stranger.id,
				},
				where: {
					archivedAtIsNull: true,
				},
			});

			expect(ownerActive.where).toBe(1);
			expect(strangerActive.where).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
