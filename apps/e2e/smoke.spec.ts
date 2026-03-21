import { expect, test } from "@playwright/test";
import { APP_ORIGIN, SERVER_ORIGIN } from "./config";

test("sign-in page loads from production preview", async ({ page }) => {
	await page.goto(`${APP_ORIGIN}/cs/sign-in`);

	await expect(page.locator('[data-ui="/login[Container]"]')).toBeVisible();
	await expect(page).toHaveTitle("Zbav se mě!");
});

test("app responds from isolated production preview", async ({ request }) => {
	const response = await request.get(`${APP_ORIGIN}/cs/app/home`);

	expect(response.ok()).toBeTruthy();
});

test("server OpenAPI responds from production preview", async ({ request }) => {
	const response = await request.get(`${SERVER_ORIGIN}/v3/api-docs`);

	expect(response.ok()).toBeTruthy();
});
