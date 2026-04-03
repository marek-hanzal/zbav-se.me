import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/seller/transaction/server/fx/transactionRejectFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionEntryCleanupSensitiveFx", () => {
	it("deletes location/package/personal entries on rejection, keeps text and status entries", async () => {
		const database = await testabase("entryCleanup-reject-sensitive");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			// Insert sensitive + non-sensitive entries directly into DB
			yield* Effect.promise(() =>
				database.kysely
					.insertInto("transaction_entry")
					.values([
						{
							id: "entry-location",
							transactionId,
							kind: "location",
							userId: seller.id,
							payload: {
								text: "location data",
							},
							createdAt: new Date(),
						},
						{
							id: "entry-package",
							transactionId,
							kind: "package",
							userId: seller.id,
							payload: {
								text: "package data",
							},
							createdAt: new Date(),
						},
						{
							id: "entry-personal",
							transactionId,
							kind: "personal",
							userId: buyer.id,
							payload: {
								text: "personal data",
							},
							createdAt: new Date(),
						},
						{
							id: "entry-text",
							transactionId,
							kind: "text",
							userId: buyer.id,
							payload: {
								text: "hello",
							},
							createdAt: new Date(),
						},
					])
					.execute(),
			);

			// Verify all 4 extra entries exist before cleanup
			const before = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", transactionId)
					.where("kind", "in", [
						"location",
						"package",
						"personal",
						"text",
					])
					.execute(),
			);

			expect(before).toHaveLength(4);

			// Rejection triggers transactionUpdateStatusFx → transactionEntryCleanupSensitiveFx
			yield* transactionRejectFx({
				transactionId,
				userId: seller.id,
			});

			const after = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", transactionId)
					.execute(),
			);

			const kinds = after.map((e) => e.kind);

			// Sensitive entries must be deleted
			expect(kinds).not.toContain("location");
			expect(kinds).not.toContain("package");
			expect(kinds).not.toContain("personal");

			// Non-sensitive entries must survive
			expect(kinds).toContain("text");
			expect(kinds).toContain("status-rejected-seller");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
