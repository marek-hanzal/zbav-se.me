import { Effect } from "effect";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { categoryFetchFx } from "~/user/category/server/fx/categoryFetchFx";
import { UploadContextFx } from "~/user/upload/server/context/UploadContextFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

export namespace createListingFx {
	export interface Props {
		categoryId?: string;
		title?: string;
		locationId?: string;
		restriction?: RestrictionEnumSchema.Type | null;
	}
}

export const createListingFx = (
	sellerId: string,
	{
		title = "Test listing",
		locationId,
		categoryId,
		restriction = null,
	}: createListingFx.Props = {},
) =>
	Effect.gen(function* () {
		const resolvedCategoryId =
			categoryId ??
			(yield* categoryFetchFx({
				userId: sellerId,
				where: {
					slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
				},
				scope: {},
			})).id;

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

		const uploadContext = yield* UploadContextFx;

		const upload = yield* uploadCreateFx({
			access: "public",
			url: `${uploadContext.cdn.replace(/\/$/, "")}/test.jpg`,
			userId: sellerId,
		});

		return yield* listingCreateFx({
			userId: sellerId,
		});
	});
