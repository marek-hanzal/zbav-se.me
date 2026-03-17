import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/@buyer/transaction/fx/transactionCreateFx";
import { withTransactionContextFx } from "~/@common/transaction/context/withTransactionContextFx";
import { withUploadFx } from "~/@common/upload/context/withUploadFx";
import { listingCreateFx } from "~/@seller/listing/fx/listingCreateFx";
import { transactionAcceptFx } from "~/@seller/transaction/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/@seller/transaction/fx/transactionResolveFx";
import { categoryFetchFx } from "~/@session/category/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { withLocationFx } from "~/@session/location/fx/withLocationFx";
import { uploadCreateFx } from "~/@user/upload/fx/uploadCreateFx";
import { auth } from "~/auth/auth";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { ServerGeoapifySchema } from "~/schema/env/ServerGeoapifySchema";
import { testabase } from "~test/testabase";
import { withTestRuntimeFx } from "~test/withTestRuntimeFx";

const withRuntimeFx = (database: Awaited<ReturnType<typeof testabase>>) => {
	const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			withKyselyFx(database),
			withDateFx,
			withTestRuntimeFx,
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

const createListingFx = (sellerId: string) =>
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

		const upload = yield* uploadCreateFx({
			url: "https://cdn.zbav-se.me/test.jpg",
			userId: sellerId,
		});

		return yield* listingCreateFx({
			age: 1,
			condition: 1,
			categoryId: category.id,
			expiresAt: "1-month",
			// biome-ignore lint/style/noNonNullAssertion: Asserted above via locationAutocompleteFx.
			locationId: location[0]!.id,
			price: 500,
			priceType: "open",
			restriction: "none",
			title: "Test listing for resolve flow",
			uploadIds: [
				upload.id,
			],
			userId: sellerId,
		});
	});

describe("transactionResolveFx — sold behavior", () => {
	it("seller resolves transaction for buyer B — buyer C gets sold, listing gets sold", async () => {
		const database = await testabase("transactionResolveFx-sold-behavior");

		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@resolve-test.cz",
				name: "Seller A",
				password: "12345678",
			},
		});

		const { user: buyerB } = await api.signUpEmail({
			body: {
				email: "buyer-b@resolve-test.cz",
				name: "Buyer B",
				password: "12345678",
			},
		});

		const { user: buyerC } = await api.signUpEmail({
			body: {
				email: "buyer-c@resolve-test.cz",
				name: "Buyer C",
				password: "12345678",
			},
		});

		// Step 1: Seller creates listing
		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		expect(listing.status).toBe("live");

		// Step 2: B and C create transactions (pending)
		await Effect.gen(function* () {
			yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyerB.id,
			});
			yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyerC.id,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const [txB, txC] = await Promise.all([
			database.kysely
				.selectFrom("transaction")
				.select("id")
				.where("listingId", "=", listing.id)
				.where("userId", "=", buyerB.id)
				.executeTakeFirstOrThrow(),
			database.kysely
				.selectFrom("transaction")
				.select("id")
				.where("listingId", "=", listing.id)
				.where("userId", "=", buyerC.id)
				.executeTakeFirstOrThrow(),
		]);

		// Step 3: Seller accepts B's transaction (pending → open)
		await Effect.gen(function* () {
			yield* transactionAcceptFx({
				transactionId: txB.id,
				userId: seller.id,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Step 4: Seller resolves B's transaction (open → resolved)
		await Effect.gen(function* () {
			yield* transactionResolveFx({
				transactionId: txB.id,
				userId: seller.id,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Verify transaction statuses
		const [finalTxB, finalTxC] = await Promise.all([
			database.kysely
				.selectFrom("transaction")
				.select("status")
				.where("id", "=", txB.id)
				.executeTakeFirstOrThrow(),
			database.kysely
				.selectFrom("transaction")
				.select("status")
				.where("id", "=", txC.id)
				.executeTakeFirstOrThrow(),
		]);

		expect(finalTxB.status).toBe("resolved");
		expect(finalTxC.status).toBe("sold");

		// Verify listing status
		const finalListing = await database.kysely
			.selectFrom("listing")
			.select("status")
			.where("id", "=", listing.id)
			.executeTakeFirstOrThrow();

		expect(finalListing.status).toBe("sold");

		// Verify transaction entries for B: status-pending, status-open, status-resolved
		const entriesB = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", txB.id)
			.orderBy("createdAt", "asc")
			.execute();

		const kindsB = entriesB.map(({ kind }) => kind);
		expect(kindsB).toContain("status-pending");
		expect(kindsB).toContain("status-open");
		expect(kindsB).toContain("status-resolved");
		expect(kindsB).not.toContain("status-sold");

		// Verify transaction entries for C: status-pending, status-sold
		const entriesC = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", txC.id)
			.orderBy("createdAt", "asc")
			.execute();

		const kindsC = entriesC.map(({ kind }) => kind);
		expect(kindsC).toContain("status-pending");
		expect(kindsC).toContain("status-sold");
		expect(kindsC).not.toContain("status-resolved");
	});
});
