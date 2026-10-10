import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { Effect } from "effect";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { leaseTestUserFx, TEST_USER_PASSWORD } from "~/test/user/fx/leaseTestUserFx";
import { expect, testFn } from "../testFn";
import { shotFn } from "../utils/shotFn";
import { uploadFixtureViaS3Fn } from "../utils/uploadFixtureViaS3Fn";

const fixturePath = path.resolve(import.meta.dirname, "../fixtures/listing-create-image.jpg");

async function expectImageLoadedFn(locator: Locator) {
	await expect(locator).toBeVisible();
	await expect
		.poll(async () => {
			return locator.evaluate((img) => {
				return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
			});
		})
		.toBe(true);
}

async function signInFn(
	page: Page,
	user: {
		email: string;
	},
) {
	await page.goto("/cs/landing");
	await page.locator('[data-action="goto sign-in"]').click();
	await page.waitForURL("/cs/sign-in");
	await page.locator('[data-ui="SignIn-[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignIn-[PasswordInput]"]').fill(TEST_USER_PASSWORD);
	await page.locator('[data-action="sign in"]').click();
	await page.waitForURL("/cs/app/home");
}

testFn.setTimeout(120_000);

testFn(
	"buyer creates transaction from listing feed and sees messages button",
	async ({ page, database }, testInfo) => {
		const { sellerUser, buyerUser } = await Effect.gen(function* () {
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
		}).pipe(withRuntimeFn(database), Effect.runPromise);

		const title = `E2E buyer transaction ${Date.now()}`;
		const upload = await uploadFixtureViaS3Fn({
			database,
			userId: sellerUser.id,
			path: fixturePath,
		});

		const listing = await createListingFx(sellerUser.id, {
			title,
			uploadId: upload.id,
		}).pipe(withRuntimeFn(database), Effect.runPromise);

		await signInFn(page, buyerUser);

		await page.locator('[data-action="open listings"]').click();
		await page.waitForURL(/\/cs\/app\/buyer\/feed\/[^/]+\/list$/);

		await shotFn(page, testInfo, "buyer-feed");

		await expect(page.getByText(title)).toBeVisible();
		await page.locator(`[data-action="open listing detail"][data-id="${listing.id}"]`).click();

		await expect(page.locator('[data-ui="ListingSheet[BottomSheet]"]')).toBeVisible();
		await expectImageLoadedFn(
			page.locator('[data-ui="ListingSheet[BottomSheet]"] img').first(),
		);

		await shotFn(page, testInfo, "listing-pre-transaction");

		await expect(page.locator('[data-action="create transaction"]')).toBeVisible();
		await page.locator('[data-action="create transaction"]').click();

		await expect(page.locator('[data-action="open transactions"]')).toBeVisible();
		await expect(page.locator('[data-action="open transactions"]')).toContainText("Zprávy");
	},
);
