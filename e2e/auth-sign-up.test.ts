import { expect } from "@playwright/test";
import { test } from "./test";
import { createBrowserUser, signUp, waitForWelcome } from "./test-helpers";

test("auth sign up", async ({ page, database, db }) => {
	void database;

	const user = createBrowserUser("signup");
	const responsePromise = page.waitForResponse((response) => {
		return (
			response.request().method() === "POST" &&
			response.url().includes("/api/auth/sign-up/email")
		);
	});

	await signUp(page, user);
	const response = await responsePromise;
	await waitForWelcome(page);
	await expect(response.headers()["x-e2e-db"]).toBe(db);
	await expect(page.locator('[data-action="go home from welcome"]')).toBeVisible();
});
