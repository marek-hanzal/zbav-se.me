import { Effect } from "effect";
import { describe, it } from "vitest";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { transactionEntryCreateFx } from "~/user-transaction-entry/fx/transactionEntryCreateFx";
import { transactionEntryGalleryFetchFx } from "~/user-transaction-entry/fx/transactionEntryGalleryFetchFx";

describe("transactionEntryGalleryFetchFx", () => {
	it("rejects non-gallery transaction entries", async () => {
		const database = await testabaseFn("transactionEntryGalleryFetchFx-non-gallery");

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

			const result = yield* Effect.result(
				transactionEntryGalleryFetchFx({
					userId: buyer.id,
					where: {
						transactionEntryId: textEntry.id,
					},
				}),
			);

			expectTaggedErrorFn(result, {
				tag: "NotFoundErrorFx",
				message: "Gallery not found",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
