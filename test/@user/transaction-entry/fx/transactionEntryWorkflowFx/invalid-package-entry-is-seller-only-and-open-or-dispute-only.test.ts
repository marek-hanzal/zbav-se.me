import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("transactionEntry workflow", () => {
	it("allows package only for seller in open/dispute flows and rejects buyer or resolved flow", async () => {
		const database = await testabase("transactionEntry-package-gate");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const openScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const resolvedScenario = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const sellerPackage = yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId: openScenario.transactionId,
				kind: "package",
				payload: {
					link: "https://tracking.example.com/1",
					number: "PKG-001",
				},
			});

			expect(sellerPackage.kind).toBe("package");
			expect(sellerPackage.direction).toBe("out");

			const buyerPackage = yield* Effect.either(
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId: openScenario.transactionId,
					kind: "package",
					payload: {
						link: "https://tracking.example.com/2",
						number: "PKG-002",
					},
				}),
			);

			const resolvedPackage = yield* Effect.either(
				transactionEntryCreateFx({
					userId: seller.id,
					transactionId: resolvedScenario.transactionId,
					kind: "package",
					payload: {
						link: "https://tracking.example.com/3",
						number: "PKG-003",
					},
				}),
			);

			expect(buyerPackage._tag).toBe("Left");
			expect(resolvedPackage._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
