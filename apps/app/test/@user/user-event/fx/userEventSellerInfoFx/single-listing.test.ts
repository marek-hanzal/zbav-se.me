import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/client/@buyer/user-event/server/fx/userEventSellerInfoFx";
import { listingCreateFx } from "~/client/@seller/listing/server/fx/listingCreateFx";
import { categoryFetchFx } from "~/client/@session/category/server/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/client/@session/location/server/fx/locationAutocompleteFx";
import { withLocationFx } from "~/client/@session/location/server/fx/withLocationFx";
import { withUploadFx } from "~/client/@user/upload/server/context/withUploadFx";
import { uploadCreateFx } from "~/client/@user/upload/server/fx/uploadCreateFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerGeoapifySchema } from "~/server/env/ServerGeoapifySchema";
import { testabase } from "~/test/testabase";

describe("userEventSellerInfoFx", () => {
	it("Single listing returns nothing", async () => {
		const database = await testabase("userEventSellerInfoFx-single-listing");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "a@x32.cz",
				name: "A-User",
				password: "12345678",
			},
		});

		const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

		const result = await Effect.gen(function* () {
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
				url: "https://cdn.zbav-se.me/test.jpg",
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

			return yield* userEventSellerInfoFx({
				userId: seller.id,
			});
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withLocationFx({
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
			}),
			withUploadFx({
				cdn: "https://cdn.zbav-se.me",
			}),
			Effect.runPromise,
		);

		expect(result).toBeNull();
	});
});
