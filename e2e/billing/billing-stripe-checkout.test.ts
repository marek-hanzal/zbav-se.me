import { expect, test } from "../test";
import { createUser } from "../utils/createUser";

const STRIPE_E2E_DATABASE_NAME = "e2e-stripe-billing";

test.use({
	dbName: STRIPE_E2E_DATABASE_NAME,
});

test.setTimeout(120_000);

test("Stripe checkout provisions buyer subscription", async ({ page, database }) => {
	test.skip(!process.env.SERVER_STRIPE_SECRET, "SERVER_STRIPE_SECRET is required");
	test.skip(
		!process.env.SERVER_STRIPE_WEBHOOK_SECRET,
		"SERVER_STRIPE_WEBHOOK_SECRET is required",
	);

	const user = createUser();

	await page.goto("/cs/landing");
	await page.click('[data-action="goto sign-up"]');
	await page.waitForURL("/cs/sign-up");

	await page.locator('[data-ui="SignUpPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignUpPage[PasswordInput]"]').fill(user.password);
	await page.locator('[data-ui="SignUpPage[ConfirmPasswordInput]"]').fill(user.password);
	await page.locator('[data-action="sign up"]').click();
	await page.waitForURL("/cs/app/welcome");

	const registeredUser = await database.kysely
		.selectFrom("user")
		.select("id")
		.where("email", "=", user.email)
		.executeTakeFirstOrThrow();

	await page.goto("/cs/app/shop");
	const checkoutButton = page.locator('[data-ui="CheckoutButton"]').first();

	await expect(checkoutButton).toBeEnabled();
	await checkoutButton.click();
	await page.waitForURL(/^https:\/\/checkout\.stripe\.com\//);

	await page.getByText(/Payment method|Způsob platby/i).scrollIntoViewIfNeeded();
	const cardNumberInput = page.getByLabel(/Card number|Číslo karty/i);

	for (let attempt = 0; attempt < 8; attempt++) {
		if (await cardNumberInput.isVisible()) {
			break;
		}

		await page.mouse.wheel(0, 500);
		await page.waitForTimeout(250);
	}

	await page.locator('[data-testid="card-accordion-item-button"]').evaluate((element) => {
		if (!(element instanceof HTMLElement)) {
			throw new Error("Stripe card payment button is not clickable");
		}

		element.click();
	});
	await expect(cardNumberInput).toBeVisible();
	await cardNumberInput.fill("4242424242424242");
	await page.getByLabel(/Expiration|Platnost|Datum vypršení/i).fill("1234");
	await page
		.getByRole("textbox", {
			name: /CVC/i,
		})
		.fill("567");

	await page
		.getByRole("textbox", {
			name: /Cardholder name|Name on card|Jméno na kartě|Jméno držitele karty|Celé jméno/i,
		})
		.fill("Stripe E2E Buyer");

	const countrySelect = page.getByLabel(/Country|region|Země|oblast/i);

	if (await countrySelect.isVisible()) {
		await countrySelect.selectOption(
			{
				value: "CZ",
			},
			{
				timeout: 10_000,
			},
		);
	}

	const postalCodeInput = page.getByLabel(/ZIP|Postal code|PSČ/i);

	if (await postalCodeInput.isVisible()) {
		await postalCodeInput.fill("11000");
	}

	await page.locator('[data-testid="hosted-payment-submit-button"]').click();
	await page.waitForURL(/\/cs\/app\/shop\?stripe=success$/);

	await expect
		.poll(
			async () => {
				return database.kysely
					.selectFrom("user_resource_bundle as urb")
					.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
					.select([
						"rb.name",
						"urb.expiresAt",
					])
					.where("urb.userId", "=", registeredUser.id)
					.where("rb.name", "=", "package:buyer")
					.executeTakeFirst();
			},
			{
				timeout: 30_000,
			},
		)
		.toEqual({
			name: "package:buyer",
			expiresAt: null,
		});

	await page.reload();
	await expect(page.locator('[data-ui="BundleItem-[Active]"]').first()).toBeVisible();
	await expect(checkoutButton).toContainText("Active");
});
