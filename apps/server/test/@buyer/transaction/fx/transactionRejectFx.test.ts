import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/@buyer/transaction/fx/transactionRejectFx";
import { auth } from "~/auth/auth";
import {
	createOpenScenarioFx,
	createPendingScenarioFx,
	withRuntimeFx,
} from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("transactionRejectFx (buyer)", () => {
	it("pending → rejected: status changes and status-rejected-buyer entry is created", async () => {
		const database = await testabase("buyerRejectFx-pending");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@buyer-reject-pending.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@buyer-reject-pending.cz",
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
			yield* transactionRejectFx({
				transactionId: tx.id,
				userId: buyer.id,
			});
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
		expect(kinds).toContain("status-rejected-buyer");
		expect(kinds).not.toContain("status-rejected-seller");
	});

	it("open → rejected: status changes and status-rejected-buyer entry is created", async () => {
		const database = await testabase("buyerRejectFx-open");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@buyer-reject-open.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@buyer-reject-open.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { transactionId } = await createOpenScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		await Effect.gen(function* () {
			yield* transactionRejectFx({
				transactionId,
				userId: buyer.id,
			});
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
		expect(kinds).toContain("status-rejected-buyer");
		expect(kinds).not.toContain("status-rejected-seller");
	});
});
