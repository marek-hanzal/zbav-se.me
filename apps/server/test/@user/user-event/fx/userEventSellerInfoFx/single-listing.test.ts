import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { categoryFetchFx } from "~/app/category/fx/categoryFetchFx";
import { listingCreateFx } from "~/app/listing/fx/listingCreateFx";
import { LocationContextProvider } from "~/app/location/context/LocationContextFx";
import { locationAutocompleteFx } from "~/app/location/fx/locationAutocompleteFx";
import { UploadContextProvider } from "~/app/upload/context/UploadContextFx";
import { uploadCreateFx } from "~/app/upload/fx/uploadCreateFx";
import { userEventSellerInfoFx } from "~/app/user-event/fx/userEventSellerInfoFx";
import { auth } from "~/auth/auth";
import { KyselyContextProvider } from "~/database/context/KyselyContextFx";
import { testabase } from "../../../../testabase";

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

		const result = await Effect.runPromise(
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
				KyselyContextProvider(database),
				LocationContextProvider({
					api: "",
					autocomplete: "",
					geoapifyToken: "",
				}),
				UploadContextProvider({
					cdn: "https://cdn.zbav-se.me",
				}),
			),
		);

		expect(result).toBeNull();
	});
});
