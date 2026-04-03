import { expect } from "@playwright/test";
import { test } from "./test";
import { createBrowserUser, signIn, signUp } from "./utils/auth";

test("seller draft create", async ({ page, database }) => {
	void database;

	const user = createBrowserUser("draft-create");

	await signUp(page, user);
	await signIn(page, user);

	await page
		.locator('[data-action="continue listing"], [data-action="create listing"]')
		.first()
		.click();

	await expect(page).toHaveURL(/\/cs\/app\/seller\/draft\/[^/]+\/edit$/);
	await expect(page.locator('[data-ui="DraftEditor-[Container.content]"]')).toBeVisible();
	await expect(page.locator('[data-action="publish listing"]')).toBeDisabled();
});
