import { Effect } from "effect";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import { categoryFetchFx } from "~/session/category/server/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

export namespace createListingFx {
	export interface Props {
		title?: string;
		locationId?: string;
	}
}

export const createListingFx = (
	sellerId: string,
	{ title = "Test listing", locationId }: createListingFx.Props = {},
) =>
	Effect.gen(function* () {
		const category = yield* categoryFetchFx({
			where: {
				slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
			},
			scope: {},
		});

		const locations = locationId
			? []
			: yield* locationAutocompleteFx({
					lang: "cs",
					text: "Praha",
					limit: 1,
				});
		const location = locations[0];
		const resolvedLocationId = locationId ?? location?.id;

		if (!resolvedLocationId) {
			throw new Error("Expected location autocomplete to return Praha");
		}

		const upload = yield* uploadCreateFx({
			url: "https://cdn.zbav-se.me/test.jpg",
			userId: sellerId,
		});

		return yield* listingCreateFx({
			age: 1,
			condition: 1,
			categoryId: category.id,
			expiresAt: "1-month",
			locationId: resolvedLocationId,
			price: 500,
			priceType: "open",
			restriction: "none",
			title,
			uploadIds: [
				upload.id,
			],
			userId: sellerId,
		});
	});
