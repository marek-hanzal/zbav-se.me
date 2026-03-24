import { expect, test } from "./test";
import { testabase } from "../utils/testabase";

test("redirects anonymous visitor to the mobile sign-in page", async ({ page }) => {
	const database = await testabase("just-test");

	await page.goto("/");

	await expect(page).toHaveURL(/\/cs\/sign-in$/);
	await expect(page.locator('[data-ui="/login[Container]"]')).toBeVisible();
});

test("navigates between public auth screens on mobile", async ({ page }) => {
	await page.goto("/cs/sign-in");

	await page.locator('a[href="/cs/sign-up"]').click();

	await expect(page).toHaveURL(/\/cs\/sign-up$/);
	await expect(page.locator('[data-ui="/register[Container]"]')).toBeVisible();
});

test("serves the public health endpoint from the preview API", async ({ request }) => {
	const apiUrl = process.env.VITE_SERVER_API;

	const response = await request.get(`${apiUrl}/api/public/health`);

	expect(response.ok()).toBeTruthy();
	await expect(response.json()).resolves.toEqual({
		status: true,
	});
});
