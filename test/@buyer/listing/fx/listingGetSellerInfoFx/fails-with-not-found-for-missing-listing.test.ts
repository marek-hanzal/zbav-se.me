import { Effect } from "effect";
import { describe, it } from "vitest";
import { listingGetSellerInfoFx } from "~/buyer-listing/fx/listingGetSellerInfoFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

describe("listingGetSellerInfoFx", () => {
	it("fails with not found for a missing listing", async () => {
		const database = await testabaseFn("listingGetSellerInfoFx-missing-listing");

		return Effect.gen(function* () {
			const result = yield* Effect.result(
				listingGetSellerInfoFx({
					listingId: "missing-listing",
				}),
			);

			expectTaggedErrorFn(result, {
				tag: "NotFoundErrorFx",
				message: "Seller info not available",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
