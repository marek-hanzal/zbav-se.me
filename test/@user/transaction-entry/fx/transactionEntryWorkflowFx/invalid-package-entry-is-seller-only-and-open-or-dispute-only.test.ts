import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCreateFx } from "~/user-transaction-entry/fx/transactionEntryCreateFx";

describe("transactionEntry workflow", () => {
	it("allows package only for seller in open/dispute flows and rejects buyer or resolved flow", async () => {
		const database = await testabaseFn("transactionEntry-package-gate");

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

			const buyerPackage = yield* Effect.result(
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

			const resolvedPackage = yield* Effect.result(
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

			expectTaggedErrorFn(buyerPackage, {
				tag: "InvalidRequestErrorFx",
			});
			expectTaggedErrorFn(resolvedPackage, {
				tag: "InvalidRequestErrorFx",
			});

			const packageEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("id")
					.where("transactionId", "=", openScenario.transactionId)
					.where("kind", "=", "package")
					.execute(),
			);

			expect(packageEntries).toHaveLength(1);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
