import { expect } from "@playwright/test";
import { test } from "./test";
import { createBrowserUser, signIn, signOut, signUp } from "./utils/auth";

test("auth sign in", async ({ page, database, db }) => {
	void database;

	const user = createBrowserUser("signin");

	await signUp(page, user);
	await signOut(page);

	await expect(page).toHaveURL(/\/cs\/landing$/);

	const responsePromise = page.waitForResponse((response) => {
		return (
			response.request().method() === "POST" &&
			response.url().includes("/api/auth/sign-in/email")
		);
	});

	await signIn(page, user);
	const response = await responsePromise;

	await expect(page).toHaveURL(/\/cs\/app\/home$/);
	await expect(response.headers()["x-e2e-db"]).toBe(db);
	await expect(page.locator('[data-ui="HomePage"]')).toBeVisible();
});
