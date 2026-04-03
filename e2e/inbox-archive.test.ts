import { expect } from "@playwright/test";
import { test } from "./test";
import {
	createBrowserUser,
	getUserIdByEmail,
	seedBuyerTransaction,
	seedPublishableDraft,
	signIn,
	signUp,
	waitForLatestInboxByUserId,
	waitForListingByDraftId,
} from "./test-helpers";

test("inbox archive", async ({ page, database }) => {
	const seller = createBrowserUser("inbox-archive");
	const title = `Codex inbox ${crypto.randomUUID().slice(0, 8)}`;

	await signUp(page, seller);
	await signIn(page, seller);

	const sellerId = await getUserIdByEmail(database, seller.email);
	const draft = await seedPublishableDraft(database, sellerId, title);

	await page.goto(`/cs/app/seller/draft/${draft.id}/edit`);
	await page.locator('[data-action="publish listing"]').click();
	await expect(page).toHaveURL(/\/cs\/app\/seller\/listing\/my$/);
	const listing = await waitForListingByDraftId(database, draft.id);

	await seedBuyerTransaction(database, listing.id);
	const inbox = await waitForLatestInboxByUserId(database, sellerId, "buyer-message");

	await page.goto("/cs/app/inbox/high");
	const inboxItem = page.locator(
		`[data-action="open buyer inbox message"][data-id="${inbox.id}"]`,
	);

	await expect(inboxItem).toBeVisible();

	await inboxItem.click();
	await expect(page).toHaveURL(/\/cs\/app\/seller\/transaction\/[^/]+\/detail$/);

	await expect
		.poll(async () => {
			const archivedInbox = await database.kysely
				.selectFrom("inbox")
				.select([
					"archivedAt",
				])
				.where("id", "=", inbox.id)
				.executeTakeFirstOrThrow();

			return archivedInbox.archivedAt !== null;
		})
		.toBe(true);
});
