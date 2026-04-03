import { expect } from "@playwright/test";
import { auth } from "~/server/auth/auth";
import { test } from "./test";
import { createBrowserUser } from "./utils/auth";

test("auth sign in", async ({ page, database }) => {
	await page.goto("/cs/landing");

	await expect(page).toHaveURL(/\/cs\/landing$/g);

	const user = createBrowserUser("signin");

	const ath = auth(() => database.dialect);
	await ath.api.signUpEmail({
		body: {
			name: user.email,
			email: user.email,
			password: user.password,
		},
	});

	await page.click('[data-action="goto sign-in"]');

	page.waitForURL(/\/cs\/sign-in$/g);

	await page.locator('[data-ui="SignInPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignInPage[PasswordInput]"]').fill(user.password);
	await page.locator('[data-action="sign in"]').click();

	await expect(page).toHaveURL(/\/cs\/app\/home$/);
	await expect(page.locator('[data-ui="HomePage"]')).toBeVisible();
});
