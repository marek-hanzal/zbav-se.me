import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import {
	patchListingSearchFixtureFx,
	seedLocationFixtureFx,
} from "~/test/listing/fx/listingSearchFixturesFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("public listing geo sort", () => {
	it("sorts nearest and farthest listings when reference location metadata is provided", async () => {
		const database = await testabase("public-listing-geo-sort");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});

			yield* seedLocationFixtureFx(database, {
				id: "loc_public_geo_brno",
				query: "Brno",
				county: "Brno-mesto",
				municipality: "Brno",
				state: "Jihomoravsky kraj",
				address: "Brno, Cesko",
				city: "Brno",
				zip: "602 00",
				hash: "test:public-geo:brno",
				lat: 49.195061,
				lon: 16.606837,
			});

			yield* seedLocationFixtureFx(database, {
				id: "loc_public_geo_ostrava",
				query: "Ostrava",
				county: "Ostrava-mesto",
				municipality: "Ostrava",
				state: "Moravskoslezsky kraj",
				address: "Ostrava, Cesko",
				city: "Ostrava",
				zip: "702 00",
				hash: "test:public-geo:ostrava",
				lat: 49.820923,
				lon: 18.262524,
			});

			const pragueListing = yield* createListingFx(users.seller.id, {
				title: "Public geo Prague",
			});
			const brnoListing = yield* createListingFx(users.seller.id, {
				title: "Public geo Brno",
				locationId: "loc_public_geo_brno",
			});
			const ostravaListing = yield* createListingFx(users.seller.id, {
				title: "Public geo Ostrava",
				locationId: "loc_public_geo_ostrava",
			});

			yield* patchListingSearchFixtureFx(database, {
				id: pragueListing.id,
				title: "qxpublicgeo-prague",
			});
			yield* patchListingSearchFixtureFx(database, {
				id: brnoListing.id,
				locationId: "loc_public_geo_brno",
				title: "qxpublicgeo-brno",
			});
			yield* patchListingSearchFixtureFx(database, {
				id: ostravaListing.id,
				locationId: "loc_public_geo_ostrava",
				title: "qxpublicgeo-ostrava",
			});

			const nearestFirst = yield* listingCollectionFx({
				scope: {},
				where: {
					fulltext: [
						"qxpublicgeo",
					],
				},
				meta: {
					locationId: "loc_public_geo_brno",
				},
				sort: [
					{
						field: "geo",
						order: "asc",
					},
				],
			});
			const farthestFirst = yield* listingCollectionFx({
				scope: {},
				where: {
					fulltext: [
						"qxpublicgeo",
					],
				},
				meta: {
					locationId: "loc_public_geo_brno",
				},
				sort: [
					{
						field: "geo",
						order: "desc",
					},
				],
			});

			expect(nearestFirst.map((item) => item.id)).toEqual([
				brnoListing.id,
				ostravaListing.id,
				pragueListing.id,
			]);
			expect(farthestFirst.map((item) => item.id)).toEqual([
				pragueListing.id,
				ostravaListing.id,
				brnoListing.id,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
