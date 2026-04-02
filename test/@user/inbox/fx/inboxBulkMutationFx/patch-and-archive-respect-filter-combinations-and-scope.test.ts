import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { inboxArchiveFx } from "~/user/inbox/server/fx/inboxArchiveFx";
import { inboxCountFx } from "~/user/inbox/server/fx/inboxCountFx";
import { inboxPatchCollectionFx } from "~/user/inbox/server/fx/inboxPatchCollectionFx";

describe("inbox bulk mutation", () => {
	it("patches and archives only scoped rows matched by combined filters", async () => {
		const database = await testabase("inboxBulkMutationFx-filters");
		const { api } = auth(() => database.dialect);
		const archivedAt = new Date("2026-04-01T14:00:00.000Z");

		return Effect.gen(function* () {
			const { buyer: owner, stranger } = yield* createUsersFx({
				api,
				slug: "inbox-bulk",
			});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("inbox")
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
							id: "bulk-owner-b",
							userId: owner.id,
							reference: [
								"listing-bulk",
								"tx-b",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-b",
								transactionEntryId: "entry-b",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T10:00:00.000Z"),
							archivedAt: null,
						},
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

			const patched = yield* inboxPatchCollectionFx({
				scope: {
					userId: owner.id,
				},
				query: {
					filter: {
						family: "transaction",
						type: "buyer-message",
						reference: "listing-bulk",
						timestampLte: new Date("2026-04-01T10:30:00.000Z"),
					},
				},
				patch: {
					archivedAt,
				},
			});

			expect(patched.map((item) => item.id).sort()).toEqual([
				"bulk-owner-a",
				"bulk-owner-b",
			]);

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
						"bulk-owner-a",
						"bulk-owner-b",
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
				"bulk-owner-a",
				"bulk-owner-b",
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
