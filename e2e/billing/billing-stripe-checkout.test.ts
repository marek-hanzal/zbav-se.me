import { Effect } from "effect";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { leaseTestUserFx, TEST_USER_PASSWORD } from "~/test/user/fx/leaseTestUserFx";
import { expect, test } from "../test";

test("Stripe checkout provisions buyer subscription", async ({ page, database }) => {
	test.skip(!process.env.SERVER_STRIPE_SECRET, "SERVER_STRIPE_SECRET is required");
	test.skip(
		!process.env.SERVER_STRIPE_WEBHOOK_SECRET,
		"SERVER_STRIPE_WEBHOOK_SECRET is required",
	);

	const user = await leaseTestUserFx({
		key: "a",
	}).pipe(withRuntimeFx(database), Effect.runPromise);

	await page.goto("/cs/landing");
	await page.click('[data-action="goto sign-in"]');
	await page.waitForURL("/cs/sign-in");

	await page.locator('[data-ui="SignInPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignInPage[PasswordInput]"]').fill(TEST_USER_PASSWORD);
	await page.locator('[data-action="sign in"]').click();
	await page.waitForURL("/cs/app/home");

	await page.goto("/cs/app/shop");
	await expect(page.locator('[data-ui="ShopPage-[CheckoutButton]"]')).toBeEnabled();
	await page.locator('[data-ui="ShopPage-[CheckoutButton]"]').click();
	await page.waitForURL(/^https:\/\/checkout\.stripe\.com\//);

	await page.getByLabel(/Card number/i).fill("4242424242424242");
	await page.getByLabel(/Expiration/i).fill("1234");
	await page.getByLabel(/CVC/i).fill("567");

	const billingNameInput = page.getByLabel(/Cardholder name|Name on card/i);

	if (await billingNameInput.isVisible()) {
		await billingNameInput.fill("Stripe E2E Buyer");
	}

	const countrySelect = page.getByLabel(/Country|region/i);

	if (await countrySelect.isVisible()) {
		await countrySelect.selectOption({
			label: "Czechia",
		});
	}

	const postalCodeInput = page.getByLabel(/ZIP|Postal code/i);

	if (await postalCodeInput.isVisible()) {
		await postalCodeInput.fill("11000");
	}

	await page
		.getByRole("button", {
			name: /Subscribe|Pay|Start/i,
		})
		.click();
	await page.waitForURL(/\/cs\/app\/shop\?stripe=success$/);
	await expect(page.locator('[data-ui="ShopPage-[BuyerTitle]"]')).toContainText(
		"Buyer subscription active",
	);

	const buyerBundle = await database.kysely
		.selectFrom("user_resource_bundle as urb")
		.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
		.select([
			"rb.name",
			"urb.expiresAt",
		])
		.where("urb.userId", "=", user.id)
		.where("rb.name", "=", "package:buyer")
		.executeTakeFirst();

	expect(buyerBundle).toEqual({
		name: "package:buyer",
		expiresAt: null,
	});
});
