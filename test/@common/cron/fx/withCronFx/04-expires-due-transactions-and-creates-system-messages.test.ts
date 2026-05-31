import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { runTransactionExpirationCronScenarioFx } from "./runTransactionExpirationCronScenarioFx";

describe("withCronFx transaction expiration", () => {
	it("expires due interest/trade/resolved/dispute transactions and creates system messages for schedule 04", async () => {
		const database = await testabase("withCronFx-transaction-expiration-04");

		return Effect.gen(function* () {
			const result = yield* runTransactionExpirationCronScenarioFx({
				database,
				schedule: "04",
				now: "2026-05-10T04:00:00.000Z",
			});

			expect(result.transactions).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: result.dueInterestScenario.transactionId,
						status: "expired",
					}),
					expect.objectContaining({
						id: result.dueTradeScenario.transactionId,
						status: "expired",
					}),
					expect.objectContaining({
						id: result.dueResolvedScenario.transactionId,
						status: "expired",
					}),
					expect.objectContaining({
						id: result.dueDisputeScenario.transactionId,
						status: "expired",
					}),
					expect.objectContaining({
						id: result.futureTradeScenario.transactionId,
						status: "trade",
					}),
				]),
			);
			expect(result.transactionEntries).toHaveLength(4);
			expect(result.transactionEntries.every(({ userId }) => userId === null)).toBe(true);
			expect(result.survivingStructuredEntries).toHaveLength(0);
			expect(result.survivingTextEntries).toHaveLength(4);
			expect(result.dueActivities).toHaveLength(8);
			expect(result.dueActivities.every(({ type }) => type === "system")).toBe(true);
			expect(
				result.dueActivities.every(({ payload }) => {
					return (
						payload != null &&
						typeof payload === "object" &&
						"transactionEntryId" in payload &&
						"target" in payload &&
						(payload.target === "buyer" || payload.target === "seller")
					);
				}),
			).toBe(true);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
