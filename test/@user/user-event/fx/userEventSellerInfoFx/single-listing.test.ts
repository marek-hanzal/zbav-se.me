import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import { categoryFetchFx } from "~/session/category/server/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("userEventSellerInfoFx", () => {
	it("Single listing returns nothing", async () => {
		const database = await testabase("userEventSellerInfoFx-single-listing");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const category = yield* categoryFetchFx({
				where: {
					slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
				},
				scope: {},
			});

			const location = yield* locationAutocompleteFx({
				lang: "cs",
				text: "Praha",
				limit: 1,
			});

			expect(location).toHaveLength(1);

			const upload = yield* uploadCreateFx({
				url: testUploadUrl("test.jpg"),
				userId: seller.id,
			});

			yield* listingCreateFx({
				age: 1,
				condition: 1,
				categoryId: category.id,
				expiresAt: "1-month",
				// biome-ignore lint/style/noNonNullAssertion: We've test assertion
				locationId: location[0]!.id,
				price: 100,
				priceType: "open",
				restriction: "none",
				title: "Some piece of crap",
				uploadIds: [
					upload.id,
				],
				userId: seller.id,
			});

			const result = yield* userEventSellerInfoFx({
				userId: seller.id,
			});

			expect(result).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
