import { Effect } from "effect";
import { listingCreateFx } from "~/@seller/listing/server/fx/listingCreateFx";
import { categoryFetchFx } from "~/@session/category/server/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/@session/location/server/fx/locationAutocompleteFx";
import { uploadCreateFx } from "~/@user/upload/server/fx/uploadCreateFx";

export const createListingFx = (sellerId: string) =>
	Effect.gen(function* () {
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

		const upload = yield* uploadCreateFx({
			url: "https://cdn.zbav-se.me/test.jpg",
			userId: sellerId,
		});

		return yield* listingCreateFx({
			age: 1,
			condition: 1,
			categoryId: category.id,
			expiresAt: "1-month",
			// biome-ignore lint/style/noNonNullAssertion: Asserted above via locationAutocompleteFx.
			locationId: location[0]!.id,
			price: 500,
			priceType: "open",
			restriction: "none",
			title: "Test listing",
			uploadIds: [
				upload.id,
			],
			userId: sellerId,
		});
	});
