import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("transactionEntry workflow", () => {
	it("rejects text, gallery, location and personal entries while transaction is pending", async () => {
		const database = await testabase("transactionEntry-pending-rejects-authored");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

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

			expectTaggedErrorFx(textResult, {
				tag: "InvalidRequestErrorFx",
			});
			expectTaggedErrorFx(galleryResult, {
				tag: "InvalidRequestErrorFx",
			});
			expectTaggedErrorFx(locationResult, {
				tag: "InvalidRequestErrorFx",
			});
			expectTaggedErrorFx(personalResult, {
				tag: "InvalidRequestErrorFx",
			});

			const transactionEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("id")
					.where("transactionId", "=", transaction.id)
					.where("kind", "in", [
						"text",
						"gallery",
						"location",
						"personal",
					])
					.execute(),
			);

			expect(transactionEntries).toHaveLength(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
