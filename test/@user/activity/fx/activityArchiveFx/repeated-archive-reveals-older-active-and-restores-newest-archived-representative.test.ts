import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import type { ActivityTableSchema } from "~/database/schema/ActivityTable";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityArchiveFx } from "~/user-activity/fx/activityArchiveFx";
import { activityCollectionFx } from "~/user-activity/fx/activityCollectionFx";
import { activityCountFx } from "~/user-activity/fx/activityCountFx";
import { activityFetchFx } from "~/user-activity/fx/activityFetchFx";

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
		withDateServiceFn({
			nowFn: () => DateTime.fromISO(iso),
		}),
	);

const seedActivityFn = async (
	database: Awaited<ReturnType<typeof testabaseFn>>,
	rows: SeedActivity[],
) => {
	await database.kysely.insertInto("activity").values(rows).execute();
};

describe("activityArchiveFx", () => {
	it("reveals the older active message after the first archive and restores the newest archived representative after the second", async () => {
		const database = await testabaseFn("activityArchiveFx-repeated-dedup-lifecycle");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				seedActivityFn(database, [
					{
						id: "msg-a",
						userId: user.id,
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
						timestamp: new Date("2026-04-10T10:00:00.000Z"),
						archivedAt: null,
					},
					{
						id: "msg-b",
						userId: user.id,
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
						timestamp: new Date("2026-04-10T10:00:00.000Z"),
						archivedAt: null,
					},
					{
						id: "reaction-c",
						userId: user.id,
						reference: [
							"listing-1",
						],
						family: "reaction",
						type: "thumb",
						payload: {
							listingId: "listing-1",
							thumb: "like",
						},
						priority: "common",
						timestamp: new Date("2026-04-10T09:00:00.000Z"),
						archivedAt: null,
					},
				]),
			);

			const beforeActive = yield* activityFetchFx({
				scope: {
					userId: user.id,
				},
				where: {
					type: "seller-message",
					referenceAllIn: [
						"listing-1",
						"transaction-1",
					],
					archivedAtIsNull: true,
				},
				sort: [
					{
						field: "timestamp",
						order: "desc",
					},
				],
			});
			const beforeActiveCount = yield* activityCountFx({
				scope: {
					userId: user.id,
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
				"2026-04-10T12:00:00.000Z",
				activityArchiveFx({
					scope: {
						userId: user.id,
					},
					where: {
						type: "seller-message",
						referenceAllIn: [
							"listing-1",
							"transaction-1",
						],
					},
				}),
			);

			const afterFirstActive = yield* activityFetchFx({
				scope: {
					userId: user.id,
				},
				where: {
					type: "seller-message",
					referenceAllIn: [
						"listing-1",
						"transaction-1",
					],
					archivedAtIsNull: true,
				},
				sort: [
					{
						field: "timestamp",
						order: "desc",
					},
				],
			});
			const afterFirstActiveCount = yield* activityCountFx({
				scope: {
					userId: user.id,
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
				"2026-04-10T12:05:00.000Z",
				activityArchiveFx({
					scope: {
						userId: user.id,
					},
					where: {
						type: "seller-message",
						referenceAllIn: [
							"listing-1",
							"transaction-1",
						],
					},
				}),
			);

			const afterSecondArchived = yield* activityFetchFx({
				scope: {
					userId: user.id,
				},
				where: {
					type: "seller-message",
					referenceAllIn: [
						"listing-1",
						"transaction-1",
					],
					archivedAtIsNull: false,
				},
				sort: [
					{
						field: "timestamp",
						order: "desc",
					},
				],
			});
			const afterSecondActiveCount = yield* activityCountFx({
				scope: {
					userId: user.id,
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
			const afterSecondArchivedCount = yield* activityCountFx({
				scope: {
					userId: user.id,
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
			const finalCollection = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				sort: [
					{
						field: "timestamp",
						order: "desc",
					},
				],
			});
			const rawRows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"id",
						"archivedAt",
					])
					.where("id", "in", [
						"msg-a",
						"msg-b",
						"reaction-c",
					])
					.orderBy("id")
					.execute(),
			);

			expect(beforeActive.id).toBe("msg-b");
			expect(beforeActiveCount).toBe(1);

			expect(afterFirstActive.id).toBe("msg-a");
			expect(afterFirstActiveCount).toBe(1);

			expect(afterSecondArchived.id).toBe("msg-b");
			expect(afterSecondActiveCount).toBe(0);
			expect(afterSecondArchivedCount).toBe(1);
			expect(finalCollection.map((item) => item.id).sort()).toEqual([
				"msg-b",
				"reaction-c",
			]);

			const archivedById = new Map(
				rawRows.map((row) => [
					row.id,
					row.archivedAt,
				]),
			);
			expect(archivedById.get("msg-a")).not.toBeNull();
			expect(archivedById.get("msg-b")).not.toBeNull();
			expect(archivedById.get("reaction-c")).toBeNull();
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
