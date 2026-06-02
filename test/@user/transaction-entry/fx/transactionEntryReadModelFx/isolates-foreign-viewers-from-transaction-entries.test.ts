import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCollectionFx } from "~/user/transaction-entry/server/fx/transactionEntryCollectionFx";
import { transactionEntryCountFx } from "~/user/transaction-entry/server/fx/transactionEntryCountFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";
import { transactionEntryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryFetchFx";

describe("transactionEntry read model", () => {
	it("isolates foreign viewers from transaction entries", async () => {
		const database = await testabase("transactionEntryReadModelFx-foreign");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const outsider = yield* leaseTestUserFx({});

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const sellerLocation = yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId,
				kind: "location",
				payload: {
					locationId: "loc_transaction_entry_read",
				},
			});

			const outsiderFetch = yield* Effect.either(
				transactionEntryFetchFx({
					userId: outsider.id,
					where: {
						id: sellerLocation.id,
					},
				}),
			);
			const outsiderCollection = yield* transactionEntryCollectionFx({
				userId: outsider.id,
				where: {
					transactionId,
					kindIn: [
						"text",
						"location",
					],
				},
			});
			const outsiderCount = yield* transactionEntryCountFx({
				userId: outsider.id,
				where: {
					transactionId,
				},
			});

			expectTaggedErrorFx(outsiderFetch, {
				tag: "NotFoundErrorFx",
			});
			expect(outsiderCollection).toHaveLength(0);
			expect(outsiderCount).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
