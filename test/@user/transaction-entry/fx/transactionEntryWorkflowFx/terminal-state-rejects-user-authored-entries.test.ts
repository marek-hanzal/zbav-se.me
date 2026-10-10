import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer-transaction/fx/transactionCloseFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCreateFx } from "~/user-transaction-entry/fx/transactionEntryCreateFx";

describe("transactionEntry workflow", () => {
	it("rejects user-authored entries after the transaction is closed", async () => {
		const database = await testabaseFn("transactionEntry-terminal-rejects-authored");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			yield* transactionCloseFx({
				transactionId,
				userId: buyer.id,
			});

			const sellerText = yield* Effect.result(
				transactionEntryCreateFx({
					userId: seller.id,
					transactionId,
					kind: "text",
					payload: {
						text: "Too late",
					},
				}),
			);
			const buyerPersonal = yield* Effect.result(
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId,
					kind: "personal",
					payload: {
						name: "Buyer",
						phone: "+420123456789",
						email: "buyer@zbav-se.me",
					},
				}),
			);

			expectTaggedErrorFn(sellerText, {
				tag: "InvalidRequestErrorFx",
			});
			expectTaggedErrorFn(buyerPersonal, {
				tag: "InvalidRequestErrorFx",
			});

			const transactionEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("id")
					.where("transactionId", "=", transactionId)
					.where("kind", "in", [
						"text",
						"personal",
					])
					.execute(),
			);

			expect(transactionEntries).toHaveLength(0);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
