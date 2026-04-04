import { auth } from "~/server/auth/auth";
import { expect, test } from "../test";
import { createUser } from "../utils/createUser";

test("auth sign in", async ({ page, database }) => {
	const user = createUser();

	const ath = auth(() => database.dialect);
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

	await expect(page.locator('[data-ui="HomeMenu"]')).toBeVisible();
});
