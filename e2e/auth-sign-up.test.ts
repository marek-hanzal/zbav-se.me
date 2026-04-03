import { expect } from "@playwright/test";
import { test } from "./test";
import { createBrowserUser } from "./utils/auth";

test("auth sign up", async ({ page, database }) => {
	void database;

	await page.goto("/cs/landing");

	const user = createBrowserUser("sign-up");

	await expect(page).toHaveURL(/\/cs\/landing$/g);

	await page.click('[data-action="goto sign-up"]');

	page.waitForURL(/\/cs\/sign-up$/g);

	await page.locator('[data-ui="SignUpPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignUpPage[PasswordInput]"]').fill(user.password);
	await page.locator('[data-ui="SignUpPage[ConfirmPasswordInput]"]').fill(user.password);
	await page.locator('[data-action="sign up"]').click();

	await page.waitForURL(/\/cs\/app\/welcome$/g);
});
