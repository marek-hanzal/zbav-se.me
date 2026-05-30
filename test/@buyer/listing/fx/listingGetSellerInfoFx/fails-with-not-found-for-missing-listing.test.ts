import { Effect } from "effect";
import { describe, it } from "vitest";
import { listingGetSellerInfoFx } from "~/buyer/listing/server/fx/listingGetSellerInfoFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("listingGetSellerInfoFx", () => {
	it("fails with not found for a missing listing", async () => {
		const database = await testabase("listingGetSellerInfoFx-missing-listing");

		return Effect.gen(function* () {
			const result = yield* Effect.either(
				listingGetSellerInfoFx({
					listingId: "missing-listing",
				}),
			);

			expectTaggedErrorFx(result, {
				tag: "NotFoundErrorFx",
				message: "Seller info not available",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
