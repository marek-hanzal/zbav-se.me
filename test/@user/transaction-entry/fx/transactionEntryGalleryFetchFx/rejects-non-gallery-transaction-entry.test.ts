import { Effect } from "effect";
import { describe, it } from "vitest";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";
import { transactionEntryGalleryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryGalleryFetchFx";

describe("transactionEntryGalleryFetchFx", () => {
	it("rejects non-gallery transaction entries", async () => {
		const database = await testabase("transactionEntryGalleryFetchFx-non-gallery");

		return Effect.gen(function* () {
			const { buyer, seller } = yield* createUsersFx({});
			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const textEntry = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId,
				kind: "text",
				payload: {
					text: "This is not a gallery",
				},
			});

			const result = yield* Effect.either(
				transactionEntryGalleryFetchFx({
					userId: buyer.id,
					where: {
						transactionEntryId: textEntry.id,
					},
				}),
			);

			expectTaggedErrorFx(result, {
				tag: "NotFoundErrorFx",
				message: "Gallery not found",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
