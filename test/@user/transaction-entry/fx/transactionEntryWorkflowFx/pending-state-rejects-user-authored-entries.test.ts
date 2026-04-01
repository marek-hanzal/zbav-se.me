import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("transactionEntry workflow", () => {
	it("rejects text, gallery, location and personal entries while transaction is pending", async () => {
		const database = await testabase("transactionEntry-pending-rejects-authored");
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
				"transaction-entry-pending-seller@test.cz",
				"Transaction Entry Pending Seller",
			);
			const { user: buyer } = yield* signUp(
				"transaction-entry-pending-buyer@test.cz",
				"Transaction Entry Pending Buyer",
			);

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const transaction = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);

			const upload = yield* uploadCreateFx({
				userId: buyer.id,
				url: "https://cdn.zbav-se.me/transaction-entry-pending-gallery.jpg",
			});

			const textResult = yield* Effect.either(
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId: transaction.id,
					kind: "text",
					payload: {
						text: "Still pending",
					},
				}),
			);
			const galleryResult = yield* Effect.either(
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId: transaction.id,
					kind: "gallery",
					payload: {
						uploadIds: [
							upload.id,
						],
					},
				}),
			);
			const locationResult = yield* Effect.either(
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId: transaction.id,
					kind: "location",
					payload: {
						locationId: "loc_pending_invalid",
					},
				}),
			);
			const personalResult = yield* Effect.either(
				transactionEntryCreateFx({
					userId: buyer.id,
					transactionId: transaction.id,
					kind: "personal",
					payload: {
						name: "Buyer",
						phone: "+420123456789",
						email: "buyer@test.cz",
						locationId: "loc_pending_invalid",
					},
				}),
			);

			expect(textResult._tag).toBe("Left");
			expect(galleryResult._tag).toBe("Left");
			expect(locationResult._tag).toBe("Left");
			expect(personalResult._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
