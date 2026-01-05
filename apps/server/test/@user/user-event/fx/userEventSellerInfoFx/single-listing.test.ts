import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { categoryFetchFx } from "~/@session/category/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { listingCreateFx } from "~/@user/listing/fx/listingCreateFx";
import { uploadCreateFx } from "~/@user/upload/fx/uploadCreateFx";
import { userEventSellerInfoFx } from "~/@user/user-event/fx/userEventSellerInfoFx";
import { auth } from "~/auth/auth";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import { testabase } from "../../../../testabase";

describe("userEventSellerInfoFx", () => {
	it("Single listing returns nothing", async () => {
		const database = await testabase("userEventSellerInfoFx-single-listing");

		const kysely = await database.kysely();

		const { api } = await auth(async () => {
			return database.dialect();
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
				});

				const location = yield* locationAutocompleteFx({
					lang: "cs",
					text: "Praha",
					limit: 1,
				});

				expect(location).toHaveLength(1);

				const upload = yield* uploadCreateFx({
					url: "https://cdn.zbav-se.me/test.jpg",
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
				});

				return yield* userEventSellerInfoFx({
					userId: "test-user-id",
				});
			}).pipe(DatabaseContextProvider(kysely), UserContextProvider(seller)),
		);

		expect(result).toBeNull();
	});
});
