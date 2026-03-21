import { expect, test } from "@playwright/test";

test("web login page loads from production preview", async ({ page }) => {
	await page.goto("http://127.0.0.1:3030/cs/login");

	await expect(page.locator('[data-ui="/login[Container]"]')).toBeVisible();
	await expect(page).toHaveTitle("Zbav se mě!");
});

test("app redirects unauthenticated users to web login", async ({ page }) => {
	await page.goto("http://127.0.0.1:3031/cs/home");

	await expect(page).toHaveURL(/:3030\/(cs|en)\/login/);
	await expect(page.locator('[data-ui="/login[Container]"]')).toBeVisible();
});

test("server OpenAPI responds from production preview", async ({ request }) => {
	const response = await request.get("http://127.0.0.1:3032/v3/api-docs");

	expect(response.ok()).toBeTruthy();
});
