import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { inboxCollectionFx } from "~/user/inbox/server/fx/inboxCollectionFx";

describe("inbox read model filters by family and type", () => {
	it("keeps family and type filters scoped to the current user", async () => {
		const database = await testabase("inboxReadModelFx-family-type");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

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

			expect(byFamily.map((item) => item.id).sort()).toEqual([
				"inbox-read-favourite-c",
				"inbox-read-thumb-b",
			]);
			expect(byType.map((item) => item.id)).toEqual([
				"inbox-read-thumb-b",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
