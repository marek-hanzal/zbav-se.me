import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/@buyer/transaction/fx/transactionCloseFx";
import { auth } from "~/auth/auth";
import { createResolvedScenarioFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("transactionCloseFx (buyer)", () => {
	it("resolved → closed: status changes and status-closed entry is created", async () => {
		const database = await testabase("buyerCloseFx-resolved-to-closed");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@buyer-close.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@buyer-close.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
			});

			yield* transactionCloseFx({
				transactionId,
				userId: buyer.id,
			});

			const { status } = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(status).toBe("closed");

			const entries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", transactionId)
					.execute(),
			);

			const kinds = entries.map((e) => e.kind);
			expect(kinds).toContain("status-resolved");
			expect(kinds).toContain("status-closed");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("invalid: cannot close an already-closed transaction", async () => {
		const database = await testabase("buyerCloseFx-double-close");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@buyer-double-close.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@buyer-double-close.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
			});

			yield* transactionCloseFx({
				transactionId,
				userId: buyer.id,
			});

			yield* Effect.promise(async () => {
				await expect(
					await transactionCloseFx({
						transactionId,
						userId: buyer.id,
					}).pipe(withRuntimeFx(database), Effect.runPromise),
				).rejects.toThrow();
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
