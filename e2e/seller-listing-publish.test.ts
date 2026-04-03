import { expect } from "@playwright/test";
import { test } from "./test";
import { createBrowserUser, signUp } from "./utils/auth";
import { getUserIdByEmail } from "./utils/database";
import { seedPublishableDraft } from "./utils/seller";

test("seller listing publish", async ({ page, database }) => {
	const user = createBrowserUser("publish");
	const title = `Codex publish ${crypto.randomUUID().slice(0, 8)}`;

	await signUp(page, user);

	const userId = await getUserIdByEmail(database, user.email);
	const draft = await seedPublishableDraft(database, userId, title);

	await page.goto(`/cs/app/seller/draft/${draft.id}/edit`);
	await expect(page.locator('[data-action="publish listing"]')).toBeEnabled();

	await page.locator('[data-action="publish listing"]').click();

	await expect(page).toHaveURL(/\/cs\/app\/seller\/listing\/my$/);
	const listing = await database.kysely
		.selectFrom("listing")
		.select([
			"id",
		])
		.where("draftId", "=", draft.id)
		.executeTakeFirstOrThrow();
	await expect(page.locator(`[data-id="${listing.id}"]`)).toBeVisible();
});
