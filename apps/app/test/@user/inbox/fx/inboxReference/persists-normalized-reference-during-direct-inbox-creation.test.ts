import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCreateFx } from "~/@seller/listing/server/fx/listingCreateFx";
import { categoryFetchFx } from "~/@session/category/server/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/@session/location/server/fx/locationAutocompleteFx";
import { inboxCreateFx } from "~/@user/inbox/server/fx/inboxCreateFx";
import { uploadCreateFx } from "~/@user/upload/server/fx/uploadCreateFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

interface ListingFixture {
	listingId: string;
	sellerId: string;
	buyerId: string;
}

const _createListingFixtureFx = ({ buyerId, sellerId }: Omit<ListingFixture, "listingId">) =>
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
	it("persists normalized reference during direct inbox creation", async () => {
		const database = await testabase("inboxReference-direct-create");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user } = await api.signUpEmail({
			body: {
				email: "inbox-reference-direct@test.cz",
				name: "Inbox Direct",
				password: "12345678",
			},
		});

		const inbox = await Effect.gen(function* () {
			return yield* inboxCreateFx({
				userId: user.id,
				reference: [
					"listing-direct",
					"transaction-direct",
				],
				family: "reaction",
				type: "favourite",
				payload: {
					listingId: "listing-direct",
				},
				priority: "common",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(inbox.reference).toEqual([
			"listing-direct",
			"transaction-direct",
		]);
	});
});
