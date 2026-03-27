import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/@buyer/transaction/server/fx/transactionCreateFx";
import { listingCreateFx } from "~/@seller/listing/server/fx/listingCreateFx";
import { categoryFetchFx } from "~/@session/category/server/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/@session/location/server/fx/locationAutocompleteFx";
import { uploadCreateFx } from "~/@user/upload/server/fx/uploadCreateFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

interface ListingFixture {
	listingId: string;
	sellerId: string;
	buyerId: string;
}

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
	it("maps transaction inbox reference from listingId", async () => {
		const database = await testabase("inboxReference-transaction-create");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "inbox-reference-seller@test.cz",
				name: "Seller Ref",
				password: "12345678",
			},
		});

		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "inbox-reference-buyer@test.cz",
				name: "Buyer Ref",
				password: "12345678",
			},
		});

		const fixture = await createListingFixtureFx({
			buyerId: buyer.id,
			sellerId: seller.id,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		await Effect.gen(function* () {
			yield* transactionCreateFx({
				listingId: fixture.listingId,
				userId: fixture.buyerId,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const transaction = await database.kysely
			.selectFrom("transaction")
			.select("id")
			.where("listingId", "=", fixture.listingId)
			.executeTakeFirstOrThrow();

		const inbox = await database.kysely
			.selectFrom("inbox")
			.select([
				"id",
				"reference",
				"type",
				"userId",
			])
			.where("userId", "=", fixture.sellerId)
			.where("type", "=", "buyer-message")
			.executeTakeFirstOrThrow();

		expect(inbox.reference).toEqual([
			fixture.listingId,
			transaction.id,
		]);
	});
});
