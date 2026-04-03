import { expect } from "@playwright/test";
import { auth } from "~/server/auth/auth";
import { test } from "./test";
import { createBrowserUser, signIn } from "./utils/auth";

test("auth sign in", async ({ page, database }) => {
	await page.goto("/cs/landing");

	await expect(page).toHaveURL(/\/cs\/landing$/g);

	const user = createBrowserUser("signin");

	const ath = auth(() => database.dialect);
	ath.api.signInEmail({
		body: {
			email: user.email,
			password: user.password,
		},
	});

	await signIn(page, user);

	await expect(page).toHaveURL(/\/cs\/app\/home$/);
	await expect(page.locator('[data-ui="HomePage"]')).toBeVisible();
});
