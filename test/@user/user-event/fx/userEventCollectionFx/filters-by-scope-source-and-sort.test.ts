import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { userEventCollectionFx } from "~/user/user-event/server/fx/userEventCollectionFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventCollectionFx", () => {
	it("filters by scope and source while keeping the requested sort order", async () => {
		const database = await testabase("userEventCollectionFx-contract");

		return Effect.gen(function* () {
			const { buyer, stranger } = yield* createUsersFx({});
			const now = DateTime.fromISO("2026-04-02T10:00:00.000Z");

			const buyerLater = yield* userEventCreateFx({
				userId: buyer.id,
				scope: "user",
				source: "transaction",
				group: "tx-a",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => now,
				}),
			);

			const buyerEarlier = yield* userEventCreateFx({
				userId: buyer.id,
				scope: "user",
				source: "transaction",
				group: "tx-b",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () =>
						now.minus({
							days: 1,
						}),
				}),
			);

			yield* userEventCreateFx({
				userId: buyer.id,
				scope: "user",
				source: "listing",
				group: "listing-1",
				event: "like",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () =>
						now.minus({
							days: 2,
						}),
				}),
			);
			yield* userEventCreateFx({
				userId: stranger.id,
				scope: "foreign",
				source: "transaction",
				group: "tx-c",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () =>
						now.minus({
							days: 3,
						}),
				}),
			);

			const collection = yield* userEventCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					source: "transaction",
					event: "transaction.message",
				},
				sort: [
					{
						field: "group",
						order: "asc",
					},
					{
						field: "createdAt",
						order: "asc",
					},
					{
						field: "id",
						order: "asc",
					},
				],
			});

			expect(collection.map((event) => event.id)).toEqual([
				buyerLater.id,
				buyerEarlier.id,
			]);
			expect(collection.every((event) => event.userId === buyer.id)).toBe(true);
			expect(collection.every((event) => event.source === "transaction")).toBe(true);
			expect(collection.every((event) => event.event === "transaction.message")).toBe(true);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
