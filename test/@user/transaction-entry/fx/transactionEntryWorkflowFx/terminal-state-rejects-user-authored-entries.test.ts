import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("transactionEntry workflow", () => {
	it("rejects user-authored entries after the transaction is closed", async () => {
		const database = await testabase("transactionEntry-terminal-rejects-authored");

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

			const sellerText = yield* Effect.either(
				transactionEntryCreateFx({
					userId: seller.id,
					transactionId,
					kind: "text",
					payload: {
						text: "Too late",
					},
				}),
			);
			const buyerPersonal = yield* Effect.either(
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId,
					kind: "personal",
					payload: {
						name: "Buyer",
						phone: "+420123456789",
						email: "buyer@test.cz",
						locationId: "loc_terminal_invalid",
					},
				}),
			);

			expect(sellerText._tag).toBe("Left");
			expect(buyerPersonal._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
