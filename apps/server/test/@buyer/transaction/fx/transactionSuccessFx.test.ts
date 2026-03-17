import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionSuccessFx } from "~/@buyer/transaction/fx/transactionSuccessFx";
import { auth } from "~/auth/auth";
import { testabase } from "~test/testabase";
import {
	createResolvedScenarioFx,
	withRuntimeFx,
} from "~test/fixture/transactionFixture";

describe("transactionSuccessFx (buyer)", () => {
	it("resolved → success: status changes and status-success entry is created", async () => {
		const database = await testabase("buyerSuccessFx-resolved-to-success");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: { email: "seller@buyer-success.cz", name: "Seller", password: "12345678" },
		});
		const { user: buyer } = await api.signUpEmail({
			body: { email: "buyer@buyer-success.cz", name: "Buyer", password: "12345678" },
		});

		const { transactionId } = await createResolvedScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		await Effect.gen(function* () {
			yield* transactionSuccessFx({ transactionId, userId: buyer.id });
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { status } = await database.kysely
			.selectFrom("transaction")
			.select("status")
			.where("id", "=", transactionId)
			.executeTakeFirstOrThrow();

		expect(status).toBe("success");

		const entries = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", transactionId)
			.execute();

		const kinds = entries.map((e) => e.kind);
		expect(kinds).toContain("status-resolved");
		expect(kinds).toContain("status-success");
	});

	it("invalid: seller cannot confirm success", async () => {
		const database = await testabase("buyerSuccessFx-seller-cannot-confirm");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: { email: "seller@buyer-success-invalid.cz", name: "Seller", password: "12345678" },
		});
		const { user: buyer } = await api.signUpEmail({
			body: { email: "buyer@buyer-success-invalid.cz", name: "Buyer", password: "12345678" },
		});

		const { transactionId } = await createResolvedScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		await expect(
			Effect.gen(function* () {
				yield* transactionSuccessFx({ transactionId, userId: seller.id });
			}).pipe(withRuntimeFx(database), Effect.runPromise),
		).rejects.toThrow();
	});
});
