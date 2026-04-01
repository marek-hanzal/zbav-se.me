import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { inboxCollectionFx } from "~/user/inbox/server/fx/inboxCollectionFx";
import { inboxCountFx } from "~/user/inbox/server/fx/inboxCountFx";
import { inboxFetchFx } from "~/user/inbox/server/fx/inboxFetchFx";

describe("inbox read model", () => {
	it("filters collection, fetch and count by inbox fields while isolating foreign items", async () => {
		const database = await testabase("inboxReadModelFx-filters");
		const { api } = auth(() => database.dialect);

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

			const { user } = yield* signUp("inbox-read-owner@test.cz", "Inbox Read Owner");
			const { user: stranger } = yield* signUp(
				"inbox-read-stranger@test.cz",
				"Inbox Read Stranger",
			);

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("inbox")
					.values([
						{
							id: "inbox-read-tx-a",
							userId: user.id,
							reference: [
								"listing-a",
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
							id: "inbox-read-thumb-b",
							userId: user.id,
							reference: [
								"listing-b",
							],
							family: "reaction",
							type: "thumb",
							payload: {
								listingId: "listing-b",
								thumb: "like",
							},
							priority: "common",
							timestamp: new Date("2026-04-01T10:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "inbox-read-favourite-c",
							userId: user.id,
							reference: [
								"listing-c",
							],
							family: "reaction",
							type: "favourite",
							payload: {
								listingId: "listing-c",
							},
							priority: "common",
							timestamp: new Date("2026-04-01T11:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "inbox-read-tx-archived",
							userId: user.id,
							reference: [
								"listing-a",
								"tx-archived",
							],
							family: "transaction",
							type: "transaction",
							payload: {
								listingId: "listing-a",
								transactionId: "tx-archived",
								transactionEntryId: "entry-archived",
								target: "seller",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T12:00:00.000Z"),
							archivedAt: new Date("2026-04-01T12:30:00.000Z"),
						},
						{
							id: "inbox-read-stranger",
							userId: stranger.id,
							reference: [
								"listing-stranger",
								"tx-stranger",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-stranger",
								transactionEntryId: "entry-stranger",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T13:00:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const all = yield* inboxCollectionFx({
				scope: {
					userId: user.id,
				},
				sort: [
					{
						field: "timestamp",
						order: "asc",
					},
				],
			});
			const byFamily = yield* inboxCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					family: "reaction",
				},
			});
			const byType = yield* inboxCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					type: "thumb",
				},
			});
			const byReference = yield* inboxCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					reference: "tx-a",
				},
			});
			const byAnyReference = yield* inboxCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					referenceIn: [
						"listing-z",
						"listing-b",
					],
				},
			});
			const byAllReference = yield* inboxCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					referenceAllIn: [
						"listing-a",
						"tx-a",
					],
				},
			});
			const archivedOnly = yield* inboxCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					archivedAtIsNull: false,
				},
			});
			const recentOnly = yield* inboxCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					timestampGte: new Date("2026-04-01T10:30:00.000Z"),
					timestampLte: new Date("2026-04-01T12:00:00.000Z"),
				},
			});
			const idSubset = yield* inboxCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					idIn: [
						"inbox-read-favourite-c",
						"inbox-read-stranger",
					],
				},
			});
			const fetched = yield* inboxFetchFx({
				scope: {
					userId: user.id,
				},
				where: {
					id: "inbox-read-thumb-b",
				},
			});
			const foreignFetch = yield* Effect.either(
				inboxFetchFx({
					scope: {
						userId: user.id,
					},
					where: {
						id: "inbox-read-stranger",
					},
				}),
			);
			const reactionCount = yield* inboxCountFx({
				scope: {
					userId: user.id,
				},
				where: {
					family: "reaction",
				},
			});
			const archivedCount = yield* inboxCountFx({
				scope: {
					userId: user.id,
				},
				where: {
					archivedAtIsNull: false,
				},
			});

			expect(all.map((item) => item.id)).toEqual([
				"inbox-read-tx-a",
				"inbox-read-thumb-b",
				"inbox-read-favourite-c",
				"inbox-read-tx-archived",
			]);
			expect(byFamily.map((item) => item.id).sort()).toEqual([
				"inbox-read-favourite-c",
				"inbox-read-thumb-b",
			]);
			expect(byType.map((item) => item.id)).toEqual([
				"inbox-read-thumb-b",
			]);
			expect(byReference.map((item) => item.id)).toEqual([
				"inbox-read-tx-a",
			]);
			expect(byAnyReference.map((item) => item.id)).toEqual([
				"inbox-read-thumb-b",
			]);
			expect(byAllReference.map((item) => item.id)).toEqual([
				"inbox-read-tx-a",
			]);
			expect(archivedOnly.map((item) => item.id)).toEqual([
				"inbox-read-tx-archived",
			]);
			expect(recentOnly.map((item) => item.id).sort()).toEqual([
				"inbox-read-favourite-c",
				"inbox-read-tx-archived",
			]);
			expect(idSubset.map((item) => item.id)).toEqual([
				"inbox-read-favourite-c",
			]);
			expect(fetched.id).toBe("inbox-read-thumb-b");
			expect(fetched.userId).toBe(user.id);
			expect(foreignFetch._tag).toBe("Left");
			expect(reactionCount.where).toBe(2);
			expect(archivedCount.where).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
