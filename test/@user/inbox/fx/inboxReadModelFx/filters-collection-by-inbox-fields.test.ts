import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createDbUserFx } from "~/test/user/fx/createDbUserFx";
import { inboxCollectionFx } from "~/user/inbox/server/fx/inboxCollectionFx";

describe("inbox read model", {
	timeout: 4_000,
}, () => {
	it("filters collections by family, type and references", async () => {
		const database = await testabase("inboxReadModelFx-collection-filters-core");

		return Effect.gen(function* () {
			const user = yield* createDbUserFx({
				email: "inbox-read-core-user@test.cz",
				name: "Inbox Read Core User",
			});
			const stranger = yield* createDbUserFx({
				email: "inbox-read-core-stranger@test.cz",
				name: "Inbox Read Core Stranger",
			});

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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("filters collections by archive, timestamp and scope", async () => {
		const database = await testabase("inboxReadModelFx-collection-filters-meta");

		return Effect.gen(function* () {
			const user = yield* createDbUserFx({
				email: "inbox-read-meta-user@test.cz",
				name: "Inbox Read Meta User",
			});
			const stranger = yield* createDbUserFx({
				email: "inbox-read-meta-stranger@test.cz",
				name: "Inbox Read Meta Stranger",
			});

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

			expect(all.map((item) => item.id)).toEqual([
				"inbox-read-tx-a",
				"inbox-read-favourite-c",
				"inbox-read-tx-archived",
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
