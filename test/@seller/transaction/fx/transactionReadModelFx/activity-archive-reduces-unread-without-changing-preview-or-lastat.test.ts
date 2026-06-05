import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFx } from "@/lib/common/date";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionCollectionFx } from "~/seller/transaction/server/fx/transactionCollectionFx";
import { transactionFetchFx } from "~/seller/transaction/server/fx/transactionFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		withDateServiceFx({
			now: () => DateTime.fromISO(iso),
		}),
	);

describe("seller transaction read model", () => {
	it("keeps preview entry and lastAt stable while buyer-message activity is archived layer by layer", async () => {
		const database = await testabase("seller-transaction-read-model-archive-keeps-preview");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});
			const scenario = yield* atFx(
				"2026-04-12T10:00:00.000Z",
				createPendingScenarioFx({
					sellerId: seller.id,
					buyerId: buyer.id,
				}),
			);

			yield* atFx(
				"2026-04-12T10:10:00.000Z",
				transactionAcceptFx({
					transactionId: scenario.transactionId,
					userId: seller.id,
				}),
			);
			yield* atFx(
				"2026-04-12T10:20:00.000Z",
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId: scenario.transactionId,
					kind: "text",
					payload: {
						text: "Buyer follow-up one",
					},
				}),
			);
			const latestEntry = yield* atFx(
				"2026-04-12T10:30:00.000Z",
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId: scenario.transactionId,
					kind: "text",
					payload: {
						text: "Buyer follow-up two",
					},
				}),
			);

			const beforeFetch = yield* transactionFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: scenario.transactionId,
				},
			});

			yield* atFx(
				"2026-04-12T11:00:00.000Z",
				activityArchiveFx({
					scope: {
						userId: seller.id,
					},
					where: {
						type: "buyer-message",
						reference: scenario.transactionId,
					},
				}),
			);

			const afterFirstFetch = yield* transactionFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: scenario.transactionId,
				},
			});
			const unreadAfterFirstArchive = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					activity: "unread",
				},
			});

			yield* atFx(
				"2026-04-12T11:05:00.000Z",
				activityArchiveFx({
					scope: {
						userId: seller.id,
					},
					where: {
						type: "buyer-message",
						reference: scenario.transactionId,
					},
				}),
			);

			const afterSecondFetch = yield* transactionFetchFx({
				scope: {
					userId: seller.id,
				},
				where: {
					id: scenario.transactionId,
				},
			});
			const archivedAfterSecondArchive = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					activity: "archived",
				},
			});

			expect(beforeFetch.entry.id).toBe(latestEntry.id);
			expect(beforeFetch.lastAt.toISOString()).toBe("2026-04-12T10:30:00.000Z");
			expect(beforeFetch.unread).toBe(2);

			expect(afterFirstFetch.entry.id).toBe(latestEntry.id);
			expect(afterFirstFetch.lastAt.toISOString()).toBe("2026-04-12T10:30:00.000Z");
			expect(afterFirstFetch.unread).toBe(1);
			expect(unreadAfterFirstArchive.map((item) => item.id)).toEqual([
				scenario.transactionId,
			]);

			expect(afterSecondFetch.entry.id).toBe(latestEntry.id);
			expect(afterSecondFetch.lastAt.toISOString()).toBe("2026-04-12T10:30:00.000Z");
			expect(afterSecondFetch.unread).toBe(0);
			expect(archivedAfterSecondArchive.map((item) => item.id)).toContain(
				scenario.transactionId,
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
