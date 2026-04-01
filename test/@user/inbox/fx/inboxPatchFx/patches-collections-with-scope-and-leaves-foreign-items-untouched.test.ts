import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { inboxCountFx } from "~/user/inbox/server/fx/inboxCountFx";
import { inboxPatchCollectionFx } from "~/user/inbox/server/fx/inboxPatchCollectionFx";

describe("inboxPatchCollectionFx", () => {
	it("patches only scoped matching items and leaves foreign rows untouched", async () => {
		const database = await testabase("inboxPatch-collection");
		const { api } = auth(() => database.dialect);
		const archivedAt = new Date("2026-04-01T11:00:00.000Z");

		return Effect.gen(function* () {
			const signUp = (email: string, name: string) =>
				Effect.promise(() =>
					api.signUpEmail({
						body: {
							email,
							name,
							password: "12345678",
						},
					}),
				);

			const { user: owner } = yield* signUp("inbox-owner@test.cz", "Inbox Owner");
			const { user: stranger } = yield* signUp("inbox-stranger@test.cz", "Inbox Stranger");

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("inbox")
					.values([
						{
							id: "owner-transaction-1",
							userId: owner.id,
							reference: [
								"listing-1",
								"tx-1",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-1",
								transactionEntryId: "entry-1",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "owner-transaction-2",
							userId: owner.id,
							reference: [
								"listing-2",
								"tx-2",
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: "tx-2",
								transactionEntryId: "entry-2",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:01:00.000Z"),
							archivedAt: null,
						},
						{
							id: "owner-reaction",
							userId: owner.id,
							reference: [
								"listing-3",
							],
							family: "reaction",
							type: "thumb",
							payload: {
								listingId: "listing-3",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:02:00.000Z"),
							archivedAt: null,
						},
						{
							id: "stranger-transaction",
							userId: stranger.id,
							reference: [
								"listing-4",
								"tx-4",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-4",
								transactionEntryId: "entry-4",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:03:00.000Z"),
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
					},
				},
				patch: {
					archivedAt,
				},
			});

			expect(patched).toHaveLength(2);
			expect(patched.every((item) => item.userId === owner.id)).toBe(true);
			expect(
				patched.every(
					(item) => item.archivedAt?.toISOString() === archivedAt.toISOString(),
				),
			).toBe(true);

			const ownerActive = yield* inboxCountFx({
				scope: {
					userId: owner.id,
				},
				filter: {
					archivedAtIsNull: true,
				},
			});

			expect(ownerActive.filter).toBe(1);

			const strangerActive = yield* inboxCountFx({
				scope: {
					userId: stranger.id,
				},
				filter: {
					archivedAtIsNull: true,
				},
			});

			expect(strangerActive.filter).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
