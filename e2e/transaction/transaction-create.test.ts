import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { Effect } from "effect";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { leaseTestUserFx, TEST_USER_PASSWORD } from "~/test/user/fx/leaseTestUserFx";
import { expect, test } from "../test";
import { shot } from "../utils/shot";
import { uploadFixtureViaS3 } from "../utils/uploadFixtureViaS3";

const fixturePath = path.resolve(import.meta.dirname, "../fixtures/listing-create-image.jpg");

async function expectImageLoaded(locator: Locator) {
	await expect(locator).toBeVisible();
	await expect
		.poll(async () => {
			return locator.evaluate((img) => {
				return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
			});
		})
		.toBe(true);
}

async function signIn(
	page: Page,
	user: {
		email: string;
	},
) {
	await page.goto("/cs/landing");
	await page.locator('[data-action="goto sign-in"]').click();
	await page.waitForURL("/cs/sign-in");
	await page.locator('[data-ui="SignInPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignInPage[PasswordInput]"]').fill(TEST_USER_PASSWORD);
	await page.locator('[data-action="sign in"]').click();
	await page.waitForURL("/cs/app/home");
}

test.setTimeout(120_000);

test("buyer creates transaction from listing feed and sees messages button", async ({
	page,
	database,
}, testInfo) => {
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
	}).pipe(withRuntimeFx(database), Effect.runPromise);

	const title = `E2E buyer transaction ${Date.now()}`;
	const upload = await uploadFixtureViaS3({
		database,
		userId: sellerUser.id,
		path: fixturePath,
	});

	const listing = await createListingFx(sellerUser.id, {
		title,
		uploadId: upload.id,
	}).pipe(withRuntimeFx(database), Effect.runPromise);

	await signIn(page, buyerUser);

	await page.locator('[data-action="open listings"]').click();
	await page.waitForURL(/\/cs\/app\/buyer\/feed\/[^/]+\/list$/);

	await shot(page, testInfo, "buyer-feed");

	await expect(page.getByText(title)).toBeVisible();
	await page.locator(`[data-action="open listing detail"][data-id="${listing.id}"]`).click();

	await expect(page.locator('[data-ui="ListingSheet"]')).toBeVisible();
	await expectImageLoaded(page.locator('[data-ui="ListingSheet"] img').first());

	await shot(page, testInfo, "listing-pre-transaction");

	await expect(page.locator('[data-action="create transaction"]')).toBeVisible();
	await page.locator('[data-action="create transaction"]').click();

	await expect(page.locator('[data-action="open transactions"]')).toBeVisible();
	await expect(page.locator('[data-action="open transactions"]')).toContainText("Zprávy");
});
