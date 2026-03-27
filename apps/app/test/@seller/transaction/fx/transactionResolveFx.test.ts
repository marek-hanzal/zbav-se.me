import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/@buyer/transaction/fx/transactionCreateFx";
import { listingCreateFx } from "~/@seller/listing/fx/listingCreateFx";
import { transactionAcceptFx } from "~/@seller/transaction/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/@seller/transaction/fx/transactionResolveFx";
import { categoryFetchFx } from "~/@session/category/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { uploadCreateFx } from "~/@user/upload/fx/uploadCreateFx";
import { auth } from "~/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

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

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@resolve-test.cz",
						name: "Seller A",
						password: "12345678",
					},
				}),
			);

			const { user: buyerB } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer-b@resolve-test.cz",
						name: "Buyer B",
						password: "12345678",
					},
				}),
			);

			const { user: buyerC } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer-c@resolve-test.cz",
						name: "Buyer C",
						password: "12345678",
					},
				}),
			);

			const listing = yield* createListingFx(seller.id);

			expect(listing.status).toBe("live");

			yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyerB.id,
			});

			yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyerC.id,
			});

			const [txB, txC] = yield* Effect.promise(() =>
				Promise.all([
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
				]),
			);

			yield* transactionAcceptFx({
				transactionId: txB.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: txB.id,
				userId: seller.id,
			});

			const [finalTxB, finalTxC] = yield* Effect.promise(() =>
				Promise.all([
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
				]),
			);

			expect(finalTxB.status).toBe("resolved");
			expect(finalTxC.status).toBe("sold");

			const finalListing = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing")
					.select("status")
					.where("id", "=", listing.id)
					.executeTakeFirstOrThrow(),
			);

			expect(finalListing.status).toBe("sold");

			const entriesB = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", txB.id)
					.orderBy("createdAt", "asc")
					.execute(),
			);

			const kindsB = entriesB.map(({ kind }) => kind);
			expect(kindsB).toContain("status-pending");
			expect(kindsB).toContain("status-open");
			expect(kindsB).toContain("status-resolved");
			expect(kindsB).not.toContain("status-sold");

			const entriesC = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", txC.id)
					.orderBy("createdAt", "asc")
					.execute(),
			);

			const kindsC = entriesC.map(({ kind }) => kind);
			expect(kindsC).toContain("status-pending");
			expect(kindsC).toContain("status-sold");
			expect(kindsC).not.toContain("status-resolved");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
