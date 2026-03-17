import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/@buyer/transaction/fx/transactionCloseFx";
import { auth } from "~/auth/auth";
import { testabase } from "~test/testabase";
import {
	createResolvedScenarioFx,
	withRuntimeFx,
} from "~test/fixture/transactionFixture";

describe("transactionCloseFx (buyer)", () => {
	it("resolved → closed: status changes and status-closed entry is created", async () => {
		const database = await testabase("buyerCloseFx-resolved-to-closed");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: { email: "seller@buyer-close.cz", name: "Seller", password: "12345678" },
		});
		const { user: buyer } = await api.signUpEmail({
			body: { email: "buyer@buyer-close.cz", name: "Buyer", password: "12345678" },
		});

		const { transactionId } = await createResolvedScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		await Effect.gen(function* () {
			yield* transactionCloseFx({ transactionId, userId: buyer.id });
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { status } = await database.kysely
			.selectFrom("transaction")
			.select("status")
			.where("id", "=", transactionId)
			.executeTakeFirstOrThrow();

		expect(status).toBe("closed");

		const entries = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", transactionId)
			.execute();

		const kinds = entries.map((e) => e.kind);
		expect(kinds).toContain("status-resolved");
		expect(kinds).toContain("status-closed");
	});

	it("invalid: cannot close an already-closed transaction", async () => {
		const database = await testabase("buyerCloseFx-double-close");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: { email: "seller@buyer-double-close.cz", name: "Seller", password: "12345678" },
		});
		const { user: buyer } = await api.signUpEmail({
			body: { email: "buyer@buyer-double-close.cz", name: "Buyer", password: "12345678" },
		});

		const { transactionId } = await createResolvedScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		await Effect.gen(function* () {
			yield* transactionCloseFx({ transactionId, userId: buyer.id });
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		await expect(
			Effect.gen(function* () {
				yield* transactionCloseFx({ transactionId, userId: buyer.id });
			}).pipe(withRuntimeFx(database), Effect.runPromise),
		).rejects.toThrow();
	});
});
