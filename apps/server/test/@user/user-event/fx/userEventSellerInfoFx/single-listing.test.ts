import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/@buyer-session/user-event/fx/userEventSellerInfoFx";
import { UploadContextLayer } from "~/@common/upload/context/UploadContextLayer";
import { listingCreateFx } from "~/@seller-user/listing/fx/listingCreateFx";
import { categoryFetchFx } from "~/@session/category/fx/categoryFetchFx";
import { LocationContextLayer } from "~/@session/location/context/LocationContextLayer";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { uploadCreateFx } from "~/@user/upload/fx/uploadCreateFx";
import { auth } from "~/auth/auth";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { ServerGeoapifySchema } from "~/schema/env/ServerGeoapifySchema";
import { testabase } from "~test/testabase";

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
			Effect.provide(KyselyContextLayer(database)),
			Effect.provide(DateContextLayer(createDateContext())),
			Effect.provide(
				LocationContextLayer({
					api: "https://api.geoapify.com",
					autocomplete: "/v1/geocode/autocomplete",
					geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
				}),
			),
			Effect.provide(
				UploadContextLayer({
					cdn: "https://cdn.zbav-se.me",
				}),
			),
			Effect.runPromise,
		);

		expect(result).toBeNull();
	});
});
