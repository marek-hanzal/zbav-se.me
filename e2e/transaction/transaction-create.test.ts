import path from "node:path";
import { Effect } from "effect";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { expect, testFn } from "../testFn";
import { expectImageLoadedFn } from "../utils/expectImageLoadedFn";
import { uploadFixtureViaS3Fn } from "../utils/uploadFixtureViaS3Fn";

const fixturePath = path.resolve(import.meta.dirname, "../fixtures/listing-create-image.jpg");

testFn.setTimeout(120_000);

testFn(
	"buyer creates transaction from listing feed and sees messages button",
	async ({ page, database, signInFn }) => {
		const { sellerUser, buyerUser } = await testFn.step("Lease seller and buyer", async () =>
			Effect.gen(function* () {
				const sellerUser = yield* leaseTestUserFx({
					key: "a",
				});
				const buyerUser = yield* leaseTestUserFx({
					key: "b",
				});

				return {
					sellerUser,
					buyerUser,
				};
			}).pipe(withRuntimeFn(database), Effect.runPromise),
		);
		const title = `E2E buyer transaction ${Date.now()}`;
		const listing = await testFn.step("Upload fixture and publish a listing", async () => {
			const upload = await uploadFixtureViaS3Fn({
				database,
				userId: sellerUser.id,
				path: fixturePath,
			});

			return createListingFx(sellerUser.id, {
				title,
				uploadId: upload.id,
			}).pipe(withRuntimeFn(database), Effect.runPromise);
		});

		await testFn.step("Sign in and open the listing from the buyer feed", async () => {
			await signInFn(buyerUser);
			await page.goto("/cs/app/home");
			await page.locator('[data-action="open listings"]').click();
			await expect(page).toHaveURL(/\/cs\/app\/buyer\/feed\/[^/]+\/list$/);
			await expect(page.getByText(title)).toBeVisible();
			await page
				.locator(`[data-action="open listing detail"][data-id="${listing.id}"]`)
				.click();
			await expect(page.locator('[data-ui="ListingSheet[BottomSheet]"]')).toBeVisible();
			await expectImageLoadedFn(
				page.locator('[data-ui="ListingSheet[BottomSheet]"] img').first(),
			);
		});

		await testFn.step("Create the transaction and open its persisted detail", async () => {
			await page.locator('[data-action="create transaction"]').click();
			const messages = page.locator('[data-action="open transactions"]');

			await expect(messages).toBeVisible();
			await expect(messages).toContainText("Zprávy");

			const transactions = await database.kysely
				.selectFrom("transaction")
				.select([
					"id",
					"userId",
					"listingId",
					"status",
				])
				.where("listingId", "=", listing.id)
				.where("userId", "=", buyerUser.id)
				.execute();

			expect(transactions).toHaveLength(1);
			const transaction = transactions[0];

			if (!transaction) {
				throw new Error(
					"Expected the buyer transaction to be saved before opening its detail",
				);
			}

			expect(transaction).toMatchObject({
				userId: buyerUser.id,
				listingId: listing.id,
				status: "interest",
			});

			await messages.click();
			await expect(page).toHaveURL(`/cs/app/buyer/transaction/${transaction.id}/detail`);
		});
	},
);
