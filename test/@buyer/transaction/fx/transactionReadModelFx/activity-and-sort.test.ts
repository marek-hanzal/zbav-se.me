import { Effect } from "effect";
import { sql } from "kysely";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { transactionDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import { transactionRejectFx } from "~/buyer/transaction/server/fx/transactionRejectFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
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

	it("sorts by status rank and archived flow returns only terminal buyer-side states", async () => {
		const database = await testabase("buyer-transaction-read-model-status-sort");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const interestScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const tradeScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const disputeScenario = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionDisputeFx({
				transactionId: disputeScenario.transactionId,
				userId: buyer.id,
			});
			const rejectedScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionRejectFx({
				transactionId: rejectedScenario.transactionId,
				userId: buyer.id,
			});
			const successScenario = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionSuccessFx({
				transactionId: successScenario.transactionId,
				userId: buyer.id,
			});
			const closedScenario = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionCloseFx({
				transactionId: closedScenario.transactionId,
				userId: buyer.id,
			});

			const statusAsc = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				sort: [
					{
						field: "status",
						order: "asc",
					},
				],
			});
			const archivedOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					flow: "archived",
				},
				sort: [
					{
						field: "status",
						order: "asc",
					},
				],
			});

			expect(statusAsc.map((item) => item.id)).toEqual([
				interestScenario.transactionId,
				tradeScenario.transactionId,
				disputeScenario.transactionId,
				rejectedScenario.transactionId,
				successScenario.transactionId,
				closedScenario.transactionId,
			]);
			expect(archivedOnly.map((item) => item.id)).toEqual([
				rejectedScenario.transactionId,
				successScenario.transactionId,
				closedScenario.transactionId,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
