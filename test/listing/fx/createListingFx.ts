import { Effect } from "effect";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftPatchFx } from "~/seller/draft/server/fx/draftPatchFx";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { categoryFetchFx } from "~/user/category/server/fx/categoryFetchFx";
import { UploadContextFx } from "~/user/upload/server/context/UploadContextFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

export namespace createListingFx {
	export interface Props {
		categoryId?: string;
		title?: string;
		description?: string;
		locationId?: string;
		restriction?: RestrictionEnumSchema.Type | null;
	}
}

export const createListingFx = (
	sellerId: string,
	{
		title = "Test listing",
		description,
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

		const draft = yield* draftCreateFx({
			userId: sellerId,
		});

		yield* draftPatchFx({
			userId: sellerId,
			query: {
				where: {
					id: draft.id,
				},
			},
			scope: {
				userId: sellerId,
			},
			patch: {
				categoryId: resolvedCategoryId,
				title,
				description,
				locationId: resolvedLocationId,
				restriction,
				priceType: "free",
				expires: "7-days",
				uploadIds: [
					upload.id,
				],
			},
		});

		return yield* listingCreateFx({
			userId: sellerId,
			draftId: draft.id,
		});
	});
