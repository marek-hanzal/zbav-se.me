import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { auth } from "~/server/auth/auth";
import { withTranslator } from "~/translator/server/withTranslator";
import { expect, test } from "../test";
import { createUser } from "../utils/createUser";

const fixturePath = path.resolve(import.meta.dirname, "../fixtures/listing-create-image.jpg");

async function clickSave(page: Page) {
	await expect(page.locator('[data-action="save"]')).toBeEnabled();
	await page.locator('[data-action="save"]').click();
}

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

test.setTimeout(120_000);

test("seller creates listing from draft flow", async ({ page, database }) => {
	const user = createUser();
	const ath = auth({
		dialect: () => database.dialect,
		translator: await withTranslator("cs"),
	});

	await ath.api.signUpEmail({
		body: {
			name: user.email,
			email: user.email,
			password: user.password,
		},
	});

	await page.goto("/cs/landing");
	await page.click('[data-action="goto sign-in"]');
	await page.waitForURL("/cs/sign-in");

	await page.locator('[data-ui="SignInPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignInPage[PasswordInput]"]').fill(user.password);
	await page.locator('[data-action="sign in"]').click();
	await page.waitForURL("/cs/app/home");

	await page.locator('[data-action="create listing"]').click();
	await page.waitForURL(/\/cs\/app\/seller\/draft\/[^/]+\/edit$/);

	await expect(page.locator('[data-ui="EditorPage"]')).toBeVisible();
	await page.locator('[data-action="set draft gallery"]').click();
	await expect(page.locator('[data-ui="GalleryPatch"]')).toBeVisible();
	await page.locator('[data-action="upload photo"]').first().setInputFiles(fixturePath);
	await expectImageLoaded(page.locator('[data-ui="PhotoUpload[Container]"] img').first());
	await clickSave(page);

	await expect(page.locator('[data-ui="TitlePatch"]')).toBeVisible();
	await page.locator("#title").fill(`E2E listing ${user.email}`);
	await clickSave(page);

	await expect(page.locator('[data-ui="CategoryPatch"]')).toBeVisible();
	await page.locator('[data-action="select category"]').first().click();
	await clickSave(page);

	await expect(page.locator('[data-ui="LocationPatch"]')).toBeVisible();
	await page.locator('[data-action="search location"]').fill("Praha");
	await page
		.getByRole("button", {
			name: "Praha, Cesko",
		})
		.click();
	await clickSave(page);

	await expect(page.locator('[data-ui="PriceTypePatch"]')).toBeVisible();
	await page.locator('[data-action="select price type fixed"]').click();
	await clickSave(page);

	await expect(page.locator('[data-ui="PricePatch"]')).toBeVisible();
	await page.locator('[data-action="dial clear"]').click();
	await page.locator('[data-action="dial digit 1"]').click();
	await page.locator('[data-action="dial digit 2"]').click();
	await page.locator('[data-action="dial digit 3"]').click();
	await clickSave(page);

	await expect(page.locator('[data-ui="ExpireAtPatch"]')).toBeVisible();
	await page.locator('[data-action="select expiration 7-days"]').click();
	await clickSave(page);

	await expect(page.locator('[data-ui="EditorPage"]')).toBeVisible();
	await expect(page.locator('[data-action="publish draft"]')).toBeEnabled();
	await page.locator('[data-action="publish draft"]').click();

	await page.waitForURL("/cs/app/seller/listing/my");
	await expect(page.getByText(`E2E listing ${user.email}`)).toBeVisible();
});
