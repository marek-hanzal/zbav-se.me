import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/@seller/transaction/fx/transactionRejectFx";
import { auth } from "~/auth/auth";
import { testabase } from "~test/testabase";
import {
	createOpenScenarioFx,
	createPendingScenarioFx,
	withRuntimeFx,
} from "~test/fixture/transactionFixture";

describe("transactionRejectFx (seller)", () => {
	it("pending → rejected: status changes and status-rejected-seller entry is created", async () => {
		const database = await testabase("sellerRejectFx-pending");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: { email: "seller@seller-reject-pending.cz", name: "Seller", password: "12345678" },
		});
		const { user: buyer } = await api.signUpEmail({
			body: { email: "buyer@seller-reject-pending.cz", name: "Buyer", password: "12345678" },
		});

		await createPendingScenarioFx({ sellerId: seller.id, buyerId: buyer.id }).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		const tx = await database.kysely
			.selectFrom("transaction")
			.select("id")
			.where("userId", "=", buyer.id)
			.executeTakeFirstOrThrow();

		await Effect.gen(function* () {
			yield* transactionRejectFx({ transactionId: tx.id, userId: seller.id });
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { status } = await database.kysely
			.selectFrom("transaction")
			.select("status")
			.where("id", "=", tx.id)
			.executeTakeFirstOrThrow();

		expect(status).toBe("rejected");

		const entries = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", tx.id)
			.execute();

		const kinds = entries.map((e) => e.kind);
		expect(kinds).toContain("status-pending");
		expect(kinds).toContain("status-rejected-seller");
		expect(kinds).not.toContain("status-rejected-buyer");
	});

	it("open → rejected: status changes and status-rejected-seller entry is created", async () => {
		const database = await testabase("sellerRejectFx-open");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: { email: "seller@seller-reject-open.cz", name: "Seller", password: "12345678" },
		});
		const { user: buyer } = await api.signUpEmail({
			body: { email: "buyer@seller-reject-open.cz", name: "Buyer", password: "12345678" },
		});

		const { transactionId } = await createOpenScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		await Effect.gen(function* () {
			yield* transactionRejectFx({ transactionId, userId: seller.id });
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { status } = await database.kysely
			.selectFrom("transaction")
			.select("status")
			.where("id", "=", transactionId)
			.executeTakeFirstOrThrow();

		expect(status).toBe("rejected");

		const entries = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", transactionId)
			.execute();

		const kinds = entries.map((e) => e.kind);
		expect(kinds).toContain("status-rejected-seller");
		expect(kinds).not.toContain("status-rejected-buyer");
	});

	it("invalid: cannot reject an already-rejected transaction", async () => {
		const database = await testabase("sellerRejectFx-double-reject");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: { email: "seller@seller-double-reject.cz", name: "Seller", password: "12345678" },
		});
		const { user: buyer } = await api.signUpEmail({
			body: { email: "buyer@seller-double-reject.cz", name: "Buyer", password: "12345678" },
		});

		await createPendingScenarioFx({ sellerId: seller.id, buyerId: buyer.id }).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		const tx = await database.kysely
			.selectFrom("transaction")
			.select("id")
			.where("userId", "=", buyer.id)
			.executeTakeFirstOrThrow();

		await Effect.gen(function* () {
			yield* transactionRejectFx({ transactionId: tx.id, userId: seller.id });
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		await expect(
			Effect.gen(function* () {
				yield* transactionRejectFx({ transactionId: tx.id, userId: seller.id });
			}).pipe(withRuntimeFx(database), Effect.runPromise),
		).rejects.toThrow();
	});
});
