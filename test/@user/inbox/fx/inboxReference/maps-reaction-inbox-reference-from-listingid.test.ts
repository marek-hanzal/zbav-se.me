import { getLogger } from "@logtape/logtape";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withLoggerFx } from "@/lib/common/log";
import { thumbCreateFx } from "~/buyer/thumb/server/fx/thumbCreateFx";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerGeoapifySchema } from "~/server/env/ServerGeoapifySchema";
import { categoryFetchFx } from "~/session/category/server/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { withLocationFx } from "~/session/location/server/fx/withLocationFx";
import { testabase } from "~/test/testabase";
import { withTransactionContextFx } from "~/user/transaction/server/context/withTransactionContextFx";
import { withUploadFx } from "~/user/upload/server/context/withUploadFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

interface ListingFixture {
	listingId: string;
	sellerId: string;
	buyerId: string;
}

const withInboxRuntimeFx = (database: Awaited<ReturnType<typeof testabase>>) => {
	const geoapifyConfig = ServerGeoapifySchema.parse(process.env);
	const logger = getLogger("zbav-se.me");

	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			withLoggerFx(logger),
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

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "inbox-reference-thumb-seller@test.cz",
						name: "Seller Thumb",
						password: "12345678",
					},
				}),
			);

			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "inbox-reference-thumb-buyer@test.cz",
						name: "Buyer Thumb",
						password: "12345678",
					},
				}),
			);

			const fixture = yield* createListingFixtureFx({
				buyerId: buyer.id,
				sellerId: seller.id,
			});

			yield* thumbCreateFx({
				listingId: fixture.listingId,
				type: "like",
				userId: fixture.buyerId,
			});

			const inbox = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select([
						"id",
						"reference",
						"type",
						"userId",
					])
					.where("userId", "=", fixture.sellerId)
					.where("type", "=", "thumb")
					.executeTakeFirstOrThrow(),
			);

			expect(inbox.reference).toEqual([
				fixture.listingId,
			]);
		}).pipe(withInboxRuntimeFx(database), Effect.runPromise);
	});
});
