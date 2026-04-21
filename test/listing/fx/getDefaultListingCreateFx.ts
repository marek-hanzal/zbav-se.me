import { Effect } from "effect";
import { categoryFetchFx } from "~/user/category/server/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";

export const getDefaultListingCreateFx = Effect.gen(function* () {
	const category = yield* categoryFetchFx({
		where: {
			slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
		},
		scope: {},
	});

	const locations = yield* locationAutocompleteFx({
		lang: "cs",
		text: "Praha",
		limit: 1,
	});
	const location = locations[0];

	if (!location?.id) {
		throw new Error("Expected location autocomplete to return Praha");
	}

	return {
		categoryId: category.id,
		locationId: location.id,
	};
});
