import { Effect } from "effect";
import { sql } from "kysely";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionCollectionFx } from "~/seller/transaction/server/fx/transactionCollectionFx";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

const countActiveBuyerMessageActivityFx = (
	database: TestDatabase,
	sellerId: string,
	transactionId: string,
) =>
	Effect.promise(async () => {
		const row = await database.kysely
			.selectFrom("activity")
			.select((eb) => eb.fn.countAll<number>().as("count"))
			.where("userId", "=", sellerId)
			.where("type", "=", "buyer-message")
			.where("archivedAt", "is", null)
			.where((eb) => {
				return sql<boolean>`${eb.ref("activity.reference")} @> ARRAY[${transactionId}]::text[]`;
			})
			.executeTakeFirstOrThrow();

		return Number(row.count);
	});

describe("seller transaction read model", () => {
	it("decrements unread one visible buyer-message layer at a time as activities are archived", async () => {
		const database = await testabase("seller-transaction-read-model-archive-buyer-messages");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});
			const scenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionAcceptFx({
				transactionId: scenario.transactionId,
				userId: seller.id,
			});

			yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId: scenario.transactionId,
				kind: "text",
				payload: {
					text: "Buyer follow-up 1",
				},
			});
			yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId: scenario.transactionId,
				kind: "text",
				payload: {
					text: "Buyer follow-up 2",
				},
			});

			const beforeCount = yield* countActiveBuyerMessageActivityFx(
				database,
				seller.id,
				scenario.transactionId,
			);
			const beforeFetch = yield* transactionFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: scenario.transactionId,
				},
			});

			yield* activityArchiveFx({
				scope: {
					userId: seller.id,
				},
				where: {
					type: "buyer-message",
					reference: scenario.transactionId,
				},
			});

			const afterFirstCount = yield* countActiveBuyerMessageActivityFx(
				database,
				seller.id,
				scenario.transactionId,
			);
			const afterFirstFetch = yield* transactionFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: scenario.transactionId,
				},
			});

			yield* activityArchiveFx({
				scope: {
					userId: seller.id,
				},
				where: {
					type: "buyer-message",
					reference: scenario.transactionId,
				},
			});

			const afterSecondCount = yield* countActiveBuyerMessageActivityFx(
				database,
				seller.id,
				scenario.transactionId,
			);
			const afterSecondFetch = yield* transactionFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: scenario.transactionId,
				},
			});

			yield* activityArchiveFx({
				scope: {
					userId: seller.id,
				},
				where: {
					type: "buyer-message",
					reference: scenario.transactionId,
				},
			});

			const afterThirdCount = yield* countActiveBuyerMessageActivityFx(
				database,
				seller.id,
				scenario.transactionId,
			);
			const unreadCollectionAfterThirdArchive = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					activity: "unread",
				},
			});
			const archivedCollectionAfterThirdArchive = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					activity: "archived",
				},
			});

			expect(beforeCount).toBe(2);
			expect(beforeFetch.unread).toBe(beforeCount);

			expect(afterFirstCount).toBe(1);
			expect(afterFirstFetch.unread).toBe(afterFirstCount);

			expect(afterSecondCount).toBe(0);
			expect(afterSecondFetch.unread).toBe(afterSecondCount);

			expect(afterThirdCount).toBe(0);
			expect(afterSecondFetch.entry.kind).toBe("text");
			expect(unreadCollectionAfterThirdArchive.map((item) => item.id)).not.toContain(
				scenario.transactionId,
			);
			expect(archivedCollectionAfterThirdArchive.map((item) => item.id)).toContain(
				scenario.transactionId,
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
