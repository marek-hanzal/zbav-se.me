import path from "node:path";
import type { Page } from "@playwright/test";
import { Effect } from "effect";
import { ListingTableSchema } from "~/database/schema/ListingTableSchema";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { expect, testFn } from "../testFn";
import { createUserFn } from "../utils/createUserFn";
import { uploadPhotoFn } from "../utils/uploadPhotoFn";

const fixturePath = path.resolve(import.meta.dirname, "../fixtures/listing-create-image.jpg");
const FREE_PLAN_GALLERY_LIMIT = 5;

testFn("new seller draft gallery uses the free plan photo limit", async ({ page }) => {
	await testFn.step("Register a new seller with the default free plan", async () => {
		const user = createUserFn();

		await page.goto("/cs/landing");
		await page.locator('[data-action="goto sign-up"]').click();
		await expect(page).toHaveURL("/cs/sign-up");
		await page.locator('[data-ui="SignUp-[EmailInput]"]').fill(user.email);
		await page.locator('[data-ui="SignUp-[PasswordInput]"]').fill(user.password);
		await page.locator('[data-ui="SignUp-[ConfirmPasswordInput]"]').fill(user.password);
		await page.locator('[data-action="sign up"]').click();
		await expect(page).toHaveURL("/cs/app/welcome");
		await page.locator('[data-action="go home from welcome"]').click();
		await expect(page).toHaveURL("/cs/app/home");
	});

	await testFn.step("Open a draft gallery and verify its five available slots", async () => {
		await page.locator('[data-action="create listing"]').click();
		await expect(page).toHaveURL(/\/cs\/app\/seller\/draft\/[^/]+\/edit$/);
		await page.locator('[data-action="set draft gallery"]').click();
		const gallery = page.locator('[data-ui="GalleryPatch"]');

		await expect(gallery).toBeVisible();
		await expect(gallery.locator('[data-ui="PhotoUpload[Container]"]')).toHaveCount(
			FREE_PLAN_GALLERY_LIMIT,
		);
		await expect(gallery.locator('[data-action="upload photo"]')).toHaveCount(
			FREE_PLAN_GALLERY_LIMIT,
		);
	});
});

testFn("seller creates listing from draft flow", async ({ page, database, signInFn }, testInfo) => {
	testFn.setTimeout(120_000);

	const user = await leaseTestUserFx({
		key: "a",
	}).pipe(withRuntimeFn(database), Effect.runPromise);
	const title = `E2E listing ${user.email}`;

	await testFn.step("Sign in and create a seller draft", async () => {
		await signInFn(user);
		await page.goto("/cs/app/home");
		await page.locator('[data-action="create listing"]').click();
		await expect(page).toHaveURL(/\/cs\/app\/seller\/draft\/[^/]+\/edit$/);
		await expect(page.locator('[data-ui="DraftEditor[TitleContainer]"]')).toBeVisible();
	});

	await testFn.step("Upload a real listing photo and save the gallery", async () => {
		await page.locator('[data-action="set draft gallery"]').click();
		const gallery = page.locator('[data-ui="GalleryPatch"]');

		await expect(gallery).toBeVisible();
		await uploadPhotoFn({
			page,
			input: gallery.locator('[data-action="upload photo"]').first(),
			filePath: fixturePath,
			image: gallery.locator('[data-ui="PhotoUpload[Container]"] img').first(),
			testInfo,
		});
		await clickSaveFn(page);
	});

	await testFn.step("Set the listing title, category, and location", async () => {
		await expect(page.locator('[data-ui="TitlePatch"]')).toBeVisible();
		await page.locator("#title").fill(title);
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
	});

	await testFn.step("Set the fixed price and seven-day expiration", async () => {
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
	});

	await testFn.step("Publish the draft and verify its saved listing", async () => {
		await expect(page.locator('[data-ui="DraftEditor[TitleContainer]"]')).toBeVisible();
		await expect(page.locator('[data-action="publish draft"]')).toBeEnabled();
		await page.locator('[data-action="publish draft"]').click();
		await expect(page).toHaveURL("/cs/app/seller/listing/my");
		await expect(page.getByText(title)).toBeVisible();

		const listing = ListingTableSchema.parse(
			await database.kysely
				.selectFrom("listing")
				.selectAll()
				.where("userId", "=", user.id)
				.where("title", "=", title)
				.executeTakeFirstOrThrow(),
		);

		expect(listing).toMatchObject({
			userId: user.id,
			title,
			status: "live",
			priceType: "fixed",
			price: 123,
			currency: "CZK",
			expires: "7-days",
		});
		expect(listing.withUploadIds).toHaveLength(1);
	});
});

async function clickSaveFn(page: Page) {
	const save = page.locator('[data-action="save"]');

	await expect(save).toBeEnabled();
	await save.click();
}
