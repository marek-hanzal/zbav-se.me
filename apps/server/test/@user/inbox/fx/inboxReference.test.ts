import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { thumbCreateFx } from "~/@buyer/thumb/fx/thumbCreateFx";
import { transactionCreateFx } from "~/@buyer/transaction/fx/transactionCreateFx";
import { withTransactionContextFx } from "~/@common/transaction/context/TransactionContextFx";
import { withUploadFx } from "~/@common/upload/context/withUploadFx";
import { listingCreateFx } from "~/@seller/listing/fx/listingCreateFx";
import { categoryFetchFx } from "~/@session/category/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { withLocationFx } from "~/@session/location/fx/withLocationFx";
import { inboxCollectionFx } from "~/@user/inbox/fx/inboxCollectionFx";
import { inboxCreateFx } from "~/@user/inbox/fx/inboxCreateFx";
import { uploadCreateFx } from "~/@user/upload/fx/uploadCreateFx";
import { auth } from "~/auth/auth";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { ServerGeoapifySchema } from "~/schema/env/ServerGeoapifySchema";
import { testabase } from "~test/testabase";
import { withTestAxiomFx } from "~test/withTestAxiomFx";

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
			withTestAxiomFx,
			withTransactionContextFx(),
			withLocationFx({
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
			}),
			withUploadFx({
				cdn: "https://cdn.zbav-se.me",
			}),
			Effect.scoped,
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
		}).pipe(withInboxRuntimeFx(database), Effect.runPromise);

		expect(inbox.reference).toEqual([
			"listing-direct",
			"transaction-direct",
		]);
	});

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
		}).pipe(withInboxRuntimeFx(database), Effect.runPromise);

		await Effect.gen(function* () {
			yield* transactionCreateFx({
				listingId: fixture.listingId,
				userId: fixture.buyerId,
			});
		}).pipe(withInboxRuntimeFx(database), Effect.runPromise);

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

	it("matches single reference and referenceIn against reference arrays", async () => {
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

		expect(singleReference.map(({ id }) => id)).toEqual([
			inboxIds.listingInboxId,
		]);
		expect(anyReference.map(({ id }) => id)).toEqual([
			inboxIds.otherInboxId,
		]);
	});
});
