import { expect, test } from "@playwright/test";

test("redirects anonymous visitor to the mobile sign-in page", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveURL(/\/[a-z]{2}\/sign-in$/);
	await expect(page.locator('[data-ui="/login[Container]"]')).toBeVisible();
});

test("navigates between public auth screens on mobile", async ({ page }) => {
	await page.goto("/cs/sign-in");

	await page.locator('a[href="/cs/sign-up"]').click();

	await expect(page).toHaveURL(/\/cs\/sign-up$/);
	await expect(page.locator('[data-ui="/register[Container]"]')).toBeVisible();
});

test("serves the public health endpoint from the preview API", async ({ request }) => {
	const apiUrl = process.env.E2E_API_URL;

	if (!apiUrl) {
		throw new Error("E2E_API_URL is required");
	}

	const response = await request.get(`${apiUrl}/api/public/health`);

	expect(response.ok()).toBeTruthy();
	await expect(response.json()).resolves.toEqual({
		status: true,
	});
});
