import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { thumbCreateFx } from "~/server/@buyer/thumb/fx/thumbCreateFx";
import { listingCreateFx } from "~/server/@seller/listing/fx/listingCreateFx";
import { categoryFetchFx } from "~/server/@session/category/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/server/@session/location/fx/locationAutocompleteFx";
import { withLocationFx } from "~/server/@session/location/fx/withLocationFx";
import { withTransactionContextFx } from "~/server/@user/transaction/context/withTransactionContextFx";
import { withUploadFx } from "~/server/@user/upload/context/withUploadFx";
import { uploadCreateFx } from "~/server/@user/upload/fx/uploadCreateFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerGeoapifySchema } from "~/server/env/ServerGeoapifySchema";
import { testabase } from "~/test/testabase";

interface ListingFixture {
	listingId: string;
	sellerId: string;
	buyerId: string;
}

const withInboxRuntimeFx = (database: Awaited<ReturnType<typeof testabase>>) => {
	const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			withKyselyFx(database),
			withDateFx,
			withTransactionContextFx(),
			withLocationFx({
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
			}),
			withUploadFx({
				cdn: "https://cdn.zbav-se.me",
			}),
		);
};

const createListingFixtureFx = ({ buyerId, sellerId }: Omit<ListingFixture, "listingId">) =>
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
			userId: sellerId,
		});

		const listing = yield* listingCreateFx({
			age: 1,
			condition: 1,
			categoryId: category.id,
			expiresAt: "1-month",
			// biome-ignore lint/style/noNonNullAssertion: Asserted above.
			locationId: location[0]!.id,
			price: 100,
			priceType: "open",
			restriction: "none",
			title: "Reference fixture listing",
			uploadIds: [
				upload.id,
			],
			userId: sellerId,
		});

		return {
			buyerId,
			listingId: listing.id,
			sellerId,
		} satisfies ListingFixture;
	});

describe("inbox reference", () => {
	it("maps reaction inbox reference from listingId", async () => {
		const database = await testabase("inboxReference-thumb-create");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "inbox-reference-thumb-seller@test.cz",
				name: "Seller Thumb",
				password: "12345678",
			},
		});

		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "inbox-reference-thumb-buyer@test.cz",
				name: "Buyer Thumb",
				password: "12345678",
			},
		});

		const fixture = await createListingFixtureFx({
			buyerId: buyer.id,
			sellerId: seller.id,
		}).pipe(withInboxRuntimeFx(database), Effect.runPromise);

		await Effect.gen(function* () {
			yield* thumbCreateFx({
				listingId: fixture.listingId,
				type: "like",
				userId: fixture.buyerId,
			});
		}).pipe(withInboxRuntimeFx(database), Effect.runPromise);

		const inbox = await database.kysely
			.selectFrom("inbox")
			.select([
				"id",
				"reference",
				"type",
				"userId",
			])
			.where("userId", "=", fixture.sellerId)
			.where("type", "=", "thumb")
			.executeTakeFirstOrThrow();

		expect(inbox.reference).toEqual([
			fixture.listingId,
		]);
	});
});
