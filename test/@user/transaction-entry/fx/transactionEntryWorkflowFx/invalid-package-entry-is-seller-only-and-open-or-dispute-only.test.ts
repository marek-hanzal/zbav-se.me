import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/utils/createOpenScenarioFx";
import { createResolvedScenarioFx } from "~/test/utils/createResolvedScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("transactionEntry workflow", () => {
	it("allows package only for seller in open/dispute flows and rejects buyer or resolved flow", async () => {
		const database = await testabase("transactionEntry-package-gate");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const signUp = (email: string, name: string) =>
				Effect.promise(() =>
					api.signUpEmail({
						body: {
							email,
							name,
							password: "12345678",
						},
					}),
				);

			const { user: seller } = yield* signUp(
				"transaction-entry-package-seller@test.cz",
				"Transaction Entry Package Seller",
			);
			const { user: buyer } = yield* signUp(
				"transaction-entry-package-buyer@test.cz",
				"Transaction Entry Package Buyer",
			);

			const openScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
			});
			const resolvedScenario = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
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
