import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/@seller/transaction/fx/transactionAcceptFx";
import { auth } from "~/auth/auth";
import { createPendingScenarioFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("transactionAcceptFx", () => {
	it("pending → open: status changes and status-open entry is created", async () => {
		const database = await testabase("transactionAcceptFx-pending-to-open");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@accept-test.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@accept-test.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		await createPendingScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const tx = await database.kysely
			.selectFrom("transaction")
			.select("id")
			.where("userId", "=", buyer.id)
			.executeTakeFirstOrThrow();

		await Effect.gen(function* () {
			yield* transactionAcceptFx({
				transactionId: tx.id,
				userId: seller.id,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { status } = await database.kysely
			.selectFrom("transaction")
			.select("status")
			.where("id", "=", tx.id)
			.executeTakeFirstOrThrow();

		expect(status).toBe("open");

		const entries = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", tx.id)
			.execute();

		const kinds = entries.map((e) => e.kind);
		expect(kinds).toContain("status-pending");
		expect(kinds).toContain("status-open");
	});

	it("invalid: buyer cannot accept their own transaction", async () => {
		const database = await testabase("transactionAcceptFx-buyer-cannot-accept");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@accept-invalid.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@accept-invalid.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		await createPendingScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const tx = await database.kysely
			.selectFrom("transaction")
			.select("id")
			.where("userId", "=", buyer.id)
			.executeTakeFirstOrThrow();

		await expect(
			Effect.gen(function* () {
				yield* transactionAcceptFx({
					transactionId: tx.id,
					userId: buyer.id,
				});
			}).pipe(withRuntimeFx(database), Effect.runPromise),
		).rejects.toThrow();
	});
});
