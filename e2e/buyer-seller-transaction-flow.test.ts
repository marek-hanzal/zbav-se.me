import { expect } from "@playwright/test";
import { test } from "./test";
import { createBrowserUser, signIn, signOut, signUp } from "./utils/auth";
import { getUserIdByEmail } from "./utils/database";
import { waitForLatestInboxByUserId } from "./utils/inbox";
import { seedPublishableDraft, waitForListingByDraftId } from "./utils/seller";

test("buyer seller transaction flow", async ({ page, database }) => {
	const seller = createBrowserUser("seller-flow");
	const buyer = createBrowserUser("buyer-flow");
	const title = `Codex flow ${crypto.randomUUID().slice(0, 8)}`;

	await signUp(page, seller);
	await signIn(page, seller);

	const sellerId = await getUserIdByEmail(database, seller.email);
	const draft = await seedPublishableDraft(database, sellerId, title);

	await page.goto(`/cs/app/seller/draft/${draft.id}/edit`);
	await page.locator('[data-action="publish listing"]').click();
	await expect(page).toHaveURL(/\/cs\/app\/seller\/listing\/my$/);
	const listing = await waitForListingByDraftId(database, draft.id);

	await signOut(page);
	const buyerPage = await page.context().newPage();
	await signUp(buyerPage, buyer);
	await signIn(buyerPage, buyer);
	await buyerPage.locator('[data-action="open listings"]').click();

	await buyerPage.locator(`[data-action="open listing detail"][data-id="${listing.id}"]`).click();
	await expect(buyerPage.locator('[data-action="create transaction"]')).toBeVisible();

	await buyerPage.locator('[data-action="create transaction"]').click();
	await expect(buyerPage.locator('[data-action="open transactions"]')).toBeVisible();

	await buyerPage.locator('[data-action="open transactions"]').click();
	await expect(buyerPage).toHaveURL(/\/cs\/app\/buyer\/transaction\/[^/]+\/detail$/);

	await signOut(buyerPage);
	await signIn(buyerPage, seller);
	await buyerPage.goto("/cs/app/inbox/high");
	const inbox = await waitForLatestInboxByUserId(database, sellerId, "buyer-message");

	await expect(
		buyerPage.locator(`[data-action="open buyer inbox message"][data-id="${inbox.id}"]`),
	).toBeVisible();
});
