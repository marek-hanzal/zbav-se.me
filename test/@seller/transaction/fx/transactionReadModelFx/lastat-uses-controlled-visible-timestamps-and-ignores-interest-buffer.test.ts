import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateServiceFx } from "@/lib/common/date";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionCollectionFx } from "~/seller/transaction/server/fx/transactionCollectionFx";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(DateServiceFx, {
			now: () => DateTime.fromISO(iso),
		}),
	);

describe("seller transaction read model", () => {
	it("uses exact visible activity timestamps for lastAt and ignores newer hidden interest text", async () => {
		const database = await testabase("seller-transaction-lastat-controlled-timestamps");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});

			const hiddenScenario = yield* atFx(
				"2026-04-02T10:00:00.000Z",
				createPendingScenarioFx({
					sellerId: seller.id,
					buyerId: buyer.id,
				}),
			);
			const visibleScenario = yield* atFx(
				"2026-04-02T10:05:00.000Z",
				createPendingScenarioFx({
					sellerId: seller.id,
					buyerId: stranger.id,
				}),
			);

			yield* atFx(
				"2026-04-02T11:45:00.000Z",
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId: hiddenScenario.transactionId,
					kind: "text",
					payload: {
						text: "Newer hidden buyer interest buffer",
					},
				}),
			);

			yield* atFx(
				"2026-04-02T10:30:00.000Z",
				transactionAcceptFx({
					transactionId: visibleScenario.transactionId,
					userId: seller.id,
				}),
			);
			const visibleEntry = yield* atFx(
				"2026-04-02T11:30:00.000Z",
				transactionEntryCreateFx({
					userId: stranger.id,
					transactionId: visibleScenario.transactionId,
					kind: "text",
					payload: {
						text: "Visible buyer message after trade",
					},
				}),
			);

			const sorted = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				sort: [
					{
						field: "lastAt",
						order: "desc",
					},
				],
			});
			const hiddenFetched = yield* transactionFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: hiddenScenario.transactionId,
				},
			});
			const visibleFetched = yield* transactionFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: visibleScenario.transactionId,
				},
			});

			expect(sorted.map((item) => item.id)).toEqual([
				visibleScenario.transactionId,
				hiddenScenario.transactionId,
			]);
			expect(visibleFetched.entry.id).toBe(visibleEntry.id);
			expect(visibleFetched.lastAt.toISOString()).toBe("2026-04-02T11:30:00.000Z");
			expect(hiddenFetched.entry.kind).toBe("status-interest");
			expect(hiddenFetched.lastAt.toISOString()).toBe("2026-04-02T10:00:00.000Z");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
