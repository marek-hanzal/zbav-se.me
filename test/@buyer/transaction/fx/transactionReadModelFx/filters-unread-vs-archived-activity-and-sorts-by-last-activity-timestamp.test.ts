import { Effect } from "effect";
import { sql } from "kysely";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("buyer transaction read model activity and sort", () => {
	it("filters unread vs archived activity and sorts by last activity timestamp", async () => {
		const database = await testabase("buyer-transaction-read-model-activity-sort");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const archivedScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId: archivedScenario.transactionId,
				kind: "text",
				payload: {
					text: "Archive me",
				},
			});
			yield* Effect.promise(() =>
				database.kysely
					.updateTable("activity")
					.set({
						archivedAt: new Date("2026-03-17T12:30:00.000Z"),
					})
					.where("userId", "=", buyer.id)
					.where("type", "=", "seller-message")
					.where((eb) => {
						return sql<boolean>`${eb.ref("activity.reference")} @> ARRAY[${archivedScenario.transactionId}]::text[]`;
					})
					.executeTakeFirstOrThrow(),
			);

			const unreadOlderScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId: unreadOlderScenario.transactionId,
				kind: "text",
				payload: {
					text: "Older unread ping",
				},
			});

			const unreadNewerScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId: unreadNewerScenario.transactionId,
				kind: "text",
				payload: {
					text: "Newest unread ping",
				},
			});

			const unreadOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					activity: "unread",
				},
				sort: [
					{
						field: "lastAt",
						order: "desc",
					},
				],
			});
			const archivedOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					activity: "archived",
				},
			});
			expect(unreadOnly.map((item) => item.id)).toEqual([
				unreadNewerScenario.transactionId,
				unreadOlderScenario.transactionId,
			]);
			expect(archivedOnly.map((item) => item.id)).toContain(archivedScenario.transactionId);
			expect(archivedOnly.map((item) => item.id)).not.toContain(
				unreadOlderScenario.transactionId,
			);
			expect(archivedOnly.map((item) => item.id)).not.toContain(
				unreadNewerScenario.transactionId,
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
