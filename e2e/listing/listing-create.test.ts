import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { Effect } from "effect";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { leaseTestUserFx, TEST_USER_PASSWORD } from "~/test/user/fx/leaseTestUserFx";
import { expect, testFn } from "../testFn";
import { createUserFn } from "../utils/createUserFn";

const fixturePath = path.resolve(import.meta.dirname, "../fixtures/listing-create-image.jpg");
const FREE_PLAN_GALLERY_LIMIT = 5;

async function clickSaveFn(page: Page) {
	await expect(page.locator('[data-action="save"]')).toBeEnabled();
	await page.locator('[data-action="save"]').click();
}

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

testFn.setTimeout(120_000);

testFn("new seller draft gallery uses the free plan photo limit", async ({ page, database }) => {
	void database;

	const user = createUserFn();

	await page.goto("/cs/landing");
	await page.click('[data-action="goto sign-up"]');
	await page.waitForURL("/cs/sign-up");

	await page.locator('[data-ui="SignUp-[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignUp-[PasswordInput]"]').fill(user.password);
	await page.locator('[data-ui="SignUp-[ConfirmPasswordInput]"]').fill(user.password);
	await page.locator('[data-action="sign up"]').click();

	await page.waitForURL("/cs/app/welcome");
	await page.locator('[data-action="go home from welcome"]').click();
	await page.waitForURL("/cs/app/home");

	await page.locator('[data-action="create listing"]').click();
	await page.waitForURL(/\/cs\/app\/seller\/draft\/[^/]+\/edit$/);

	await page.locator('[data-action="set draft gallery"]').click();
	await expect(page.locator('[data-ui="GalleryPatch"]')).toBeVisible();
	await expect(
		page.locator('[data-ui="GalleryPatch"] [data-ui="PhotoUpload[Container]"]'),
	).toHaveCount(FREE_PLAN_GALLERY_LIMIT);
	await expect(page.locator('[data-ui="GalleryPatch"] [data-action="upload photo"]')).toHaveCount(
		FREE_PLAN_GALLERY_LIMIT,
	);
});

testFn("seller creates listing from draft flow", async ({ page, database }) => {
	const user = await leaseTestUserFx({
		key: "a",
	}).pipe(withRuntimeFn(database), Effect.runPromise);

	await page.goto("/cs/landing");
	await page.click('[data-action="goto sign-in"]');
	await page.waitForURL("/cs/sign-in");

	await page.locator('[data-ui="SignIn-[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignIn-[PasswordInput]"]').fill(TEST_USER_PASSWORD);
	await page.locator('[data-action="sign in"]').click();
	await page.waitForURL("/cs/app/home");

	await page.locator('[data-action="create listing"]').click();
	await page.waitForURL(/\/cs\/app\/seller\/draft\/[^/]+\/edit$/);

	await expect(page.locator('[data-ui="DraftEditor[TitleContainer]"]')).toBeVisible();
	await page.locator('[data-action="set draft gallery"]').click();
	await expect(page.locator('[data-ui="GalleryPatch"]')).toBeVisible();
	await page.locator('[data-action="upload photo"]').first().setInputFiles(fixturePath);
	await expectImageLoadedFn(page.locator('[data-ui="PhotoUpload[Container]"] img').first());
	await clickSaveFn(page);

	await expect(page.locator('[data-ui="TitlePatch"]')).toBeVisible();
	await page.locator("#title").fill(`E2E listing ${user.email}`);
	await clickSaveFn(page);

	await expect(page.locator('[data-ui="CategoryPatch"]')).toBeVisible();
	await page.locator('[data-action="select category"]').first().click();
	await clickSaveFn(page);

	await expect(page.locator('[data-ui="LocationPatch"]')).toBeVisible();
	await page.locator('[data-action="search location"]').fill("Praha");
	await page
		.getByRole("button", {
			name: "Praha, Cesko",
		})
		.click();
	await clickSaveFn(page);

	await expect(page.locator('[data-ui="PriceTypePatch"]')).toBeVisible();
	await page.locator('[data-action="select price type fixed"]').click();
	await clickSaveFn(page);

	await expect(page.locator('[data-ui="PricePatch"]')).toBeVisible();
	await page.locator('[data-action="dial clear"]').click();
	await page.locator('[data-action="dial digit 1"]').click();
	await page.locator('[data-action="dial digit 2"]').click();
	await page.locator('[data-action="dial digit 3"]').click();
	await clickSaveFn(page);

	await expect(page.locator('[data-ui="ExpireAtPatch"]')).toBeVisible();
	await page.locator('[data-action="select expiration 7-days"]').click();
	await clickSaveFn(page);

	await expect(page.locator('[data-ui="DraftEditor[TitleContainer]"]')).toBeVisible();
	await expect(page.locator('[data-action="publish draft"]')).toBeEnabled();
	await page.locator('[data-action="publish draft"]').click();

	await page.waitForURL("/cs/app/seller/listing/my");
	await expect(page.getByText(`E2E listing ${user.email}`)).toBeVisible();
});
