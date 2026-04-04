import { expect, test } from "../test";
import { createUser } from "../utils/createUser";

test("auth sign up", async ({ page, database }) => {
	void database;

	const user = createUser();

	await page.goto("/cs/landing");

	await page.click('[data-action="goto sign-up"]');

	await page.waitForURL("/cs/sign-up");

	await page.locator('[data-ui="SignUpPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignUpPage[PasswordInput]"]').fill(user.password);
	await page.locator('[data-ui="SignUpPage[ConfirmPasswordInput]"]').fill(user.password);
	await page.locator('[data-action="sign up"]').click();

	await page.waitForURL("/cs/app/welcome");

	await expect(page.locator('[data-ui="WelcomePage"]')).toBeVisible();
});
