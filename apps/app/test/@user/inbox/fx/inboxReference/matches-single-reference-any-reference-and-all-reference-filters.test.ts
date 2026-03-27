import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCreateFx } from "~/server/@seller/listing/fx/listingCreateFx";
import { categoryFetchFx } from "~/server/@session/category/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/server/@session/location/fx/locationAutocompleteFx";
import { withLocationFx } from "~/server/@session/location/fx/withLocationFx";
import { inboxCollectionFx } from "~/server/@user/inbox/fx/inboxCollectionFx";
import { inboxCreateFx } from "~/server/@user/inbox/fx/inboxCreateFx";
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
			withTransactionContextFx({
				expires: 3,
				extend: 3,
			}),
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
	it("matches single reference, any-reference and all-reference filters", async () => {
		const database = await testabase("inboxReference-query-filtering");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user } = await api.signUpEmail({
			body: {
				email: "inbox-reference-filter@test.cz",
				name: "Inbox Filter",
				password: "12345678",
			},
		});

		const inboxIds = await Effect.gen(function* () {
			const listingInbox = yield* inboxCreateFx({
				userId: user.id,
				reference: [
					"listing-1",
					"transaction-1",
				],
				family: "transaction",
				type: "transaction",
				payload: {
					listingId: "listing-1",
					target: "seller",
					transactionId: "transaction-1",
				},
				priority: "high",
			});

			const otherInbox = yield* inboxCreateFx({
				userId: user.id,
				reference: [
					"listing-2",
					"transaction-2",
				],
				family: "transaction",
				type: "transaction",
				payload: {
					listingId: "listing-2",
					target: "seller",
					transactionId: "transaction-2",
				},
				priority: "high",
			});

			return {
				listingInboxId: listingInbox.id,
				otherInboxId: otherInbox.id,
			};
		}).pipe(withInboxRuntimeFx(database), Effect.runPromise);

		const singleReference = await Effect.gen(function* () {
			return yield* inboxCollectionFx({
				where: {
					reference: "transaction-1",
				},
				scope: {
					userId: user.id,
				},
			});
		}).pipe(withInboxRuntimeFx(database), Effect.runPromise);

		const anyReference = await Effect.gen(function* () {
			return yield* inboxCollectionFx({
				where: {
					referenceIn: [
						"listing-3",
						"listing-2",
					],
				},
				scope: {
					userId: user.id,
				},
			});
		}).pipe(withInboxRuntimeFx(database), Effect.runPromise);

		const allReference = await Effect.gen(function* () {
			return yield* inboxCollectionFx({
				where: {
					referenceAllIn: [
						"listing-1",
						"transaction-1",
					],
				},
				scope: {
					userId: user.id,
				},
			});
		}).pipe(withInboxRuntimeFx(database), Effect.runPromise);

		expect(singleReference.map(({ id }) => id)).toEqual([
			inboxIds.listingInboxId,
		]);
		expect(anyReference.map(({ id }) => id)).toEqual([
			inboxIds.otherInboxId,
		]);
		expect(allReference.map(({ id }) => id)).toEqual([
			inboxIds.listingInboxId,
		]);
	});
});
