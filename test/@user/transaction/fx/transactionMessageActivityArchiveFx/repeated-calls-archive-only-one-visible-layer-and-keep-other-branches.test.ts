import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import type { ActivityTableSchema } from "~/server/database/@table/ActivityTableSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCountFx } from "~/user/activity/server/fx/activityCountFx";
import { activityFetchFx } from "~/user/activity/server/fx/activityFetchFx";
import { transactionMessageActivityArchiveFx } from "~/user/transaction/server/fx/transactionMessageActivityArchiveFx";

type SeedActivity = Pick<
	ActivityTableSchema.Type,
	| "archivedAt"
	| "family"
	| "id"
	| "payload"
	| "priority"
	| "reference"
	| "timestamp"
	| "type"
	| "userId"
>;

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(DateContextFx, {
			now: () => DateTime.fromISO(iso),
		}),
	);

const seedActivity = async (
	database: Awaited<ReturnType<typeof testabase>>,
	rows: SeedActivity[],
) => {
	await database.kysely.insertInto("activity").values(rows).execute();
};

describe("transactionMessageActivityArchiveFx", () => {
	it("archives one visible scoped layer at a time and leaves sibling branches untouched", async () => {
		const database = await testabase(
			"transactionMessageActivityArchiveFx-repeated-scoped-layers",
		);

		return Effect.gen(function* () {
			const owner = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				seedActivity(database, [
					{
						id: "target-old",
						userId: owner.id,
						reference: [
							"listing-1",
							"transaction-1",
						],
						family: "transaction",
						type: "seller-message",
						payload: {
							transactionId: "transaction-1",
						},
						priority: "high",
						timestamp: new Date("2026-04-11T10:00:00.000Z"),
						archivedAt: null,
					},
					{
						id: "target-new",
						userId: owner.id,
						reference: [
							"listing-1",
							"transaction-1",
						],
						family: "transaction",
						type: "seller-message",
						payload: {
							transactionId: "transaction-1",
						},
						priority: "high",
						timestamp: new Date("2026-04-11T10:05:00.000Z"),
						archivedAt: null,
					},
					{
						id: "keep-different-listing-different-transaction",
						userId: owner.id,
						reference: [
							"listing-2",
							"transaction-3",
						],
						family: "transaction",
						type: "seller-message",
						payload: {
							transactionId: "transaction-3",
						},
						priority: "high",
						timestamp: new Date("2026-04-11T10:06:00.000Z"),
						archivedAt: null,
					},
					{
						id: "keep-same-listing-different-transaction",
						userId: owner.id,
						reference: [
							"listing-1",
							"transaction-2",
						],
						family: "transaction",
						type: "seller-message",
						payload: {
							transactionId: "transaction-2",
						},
						priority: "high",
						timestamp: new Date("2026-04-11T10:07:00.000Z"),
						archivedAt: null,
					},
					{
						id: "keep-wrong-type",
						userId: owner.id,
						reference: [
							"listing-1",
							"transaction-1",
						],
						family: "transaction",
						type: "buyer-message",
						payload: {
							transactionId: "transaction-1",
						},
						priority: "high",
						timestamp: new Date("2026-04-11T10:08:00.000Z"),
						archivedAt: null,
					},
				]),
			);

			const beforeVisible = yield* activityFetchFx({
				scope: {
					userId: owner.id,
				},
				where: {
					type: "seller-message",
					referenceAllIn: [
						"listing-1",
						"transaction-1",
					],
					archivedAtIsNull: true,
				},
			});

			yield* atFx(
				"2026-04-11T12:00:00.000Z",
				transactionMessageActivityArchiveFx({
					listingId: "listing-1",
					transactionId: "transaction-1",
					type: "seller-message",
					userId: owner.id,
				}),
			);

			const afterFirstVisible = yield* activityFetchFx({
				scope: {
					userId: owner.id,
				},
				where: {
					type: "seller-message",
					referenceAllIn: [
						"listing-1",
						"transaction-1",
					],
					archivedAtIsNull: true,
				},
			});
			const afterFirstActiveCount = yield* activityCountFx({
				scope: {
					userId: owner.id,
				},
				where: {
					type: "seller-message",
					referenceAllIn: [
						"listing-1",
						"transaction-1",
					],
					archivedAtIsNull: true,
				},
			});

			yield* atFx(
				"2026-04-11T12:05:00.000Z",
				transactionMessageActivityArchiveFx({
					listingId: "listing-1",
					transactionId: "transaction-1",
					type: "seller-message",
					userId: owner.id,
				}),
			);

			const afterSecondArchived = yield* activityFetchFx({
				scope: {
					userId: owner.id,
				},
				where: {
					type: "seller-message",
					referenceAllIn: [
						"listing-1",
						"transaction-1",
					],
					archivedAtIsNull: false,
				},
			});
			const afterSecondActiveCount = yield* activityCountFx({
				scope: {
					userId: owner.id,
				},
				where: {
					type: "seller-message",
					referenceAllIn: [
						"listing-1",
						"transaction-1",
					],
					archivedAtIsNull: true,
				},
			});
			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"id",
						"archivedAt",
					])
					.orderBy("id")
					.execute(),
			);

			expect(beforeVisible.id).toBe("target-new");
			expect(afterFirstVisible.id).toBe("target-old");
			expect(afterFirstActiveCount).toBe(1);
			expect(afterSecondArchived.id).toBe("target-new");
			expect(afterSecondActiveCount).toBe(0);

			const archivedById = new Map(
				rows.map((row) => [
					row.id,
					row.archivedAt,
				]),
			);

			expect(archivedById.get("target-old")).not.toBeNull();
			expect(archivedById.get("target-new")).not.toBeNull();
			expect(archivedById.get("keep-different-listing-different-transaction")).toBeNull();
			expect(archivedById.get("keep-same-listing-different-transaction")).toBeNull();
			expect(archivedById.get("keep-wrong-type")).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
