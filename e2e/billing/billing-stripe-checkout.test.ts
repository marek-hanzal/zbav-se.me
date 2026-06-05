import type { Page } from "@playwright/test";
import Stripe from "stripe";
import { expect, test } from "../test";
import { createUser } from "../utils/createUser";

const STRIPE_E2E_DATABASE_NAME = "e2e-stripe-billing";

test.use({
	dbName: STRIPE_E2E_DATABASE_NAME,
});

test.setTimeout(120_000);

interface StripeCardFormProps {
	cardholderName: string;
	page: Page;
}

async function fillStripeCardForm({ cardholderName, page }: StripeCardFormProps) {
	await page.getByText(/Payment method|Způsob platby/i).scrollIntoViewIfNeeded();
	const cardNumberInput = page
		.getByLabel(/Card number|Číslo karty/i)
		.or(page.getByPlaceholder(/1234 1234 1234/i))
		.first();
	const cardRadio = page.locator('input[type="radio"][value="card"]').first();
	const cardMethodButton = page.locator('[data-testid="card-accordion-item-button"]').first();

	if (!(await cardNumberInput.isVisible())) {
		if ((await cardRadio.count()) > 0) {
			await cardRadio.click({
				force: true,
				timeout: 10_000,
			});
		} else if (await cardMethodButton.isVisible()) {
			await cardMethodButton.click({
				force: true,
				timeout: 10_000,
			});
		}
	}

	for (let attempt = 0; attempt < 8; attempt++) {
		if (await cardNumberInput.isVisible()) {
			break;
		}

		await page.mouse.wheel(0, 500);
		await page.waitForTimeout(250);
	}

	await expect(cardNumberInput).toBeVisible();
	await cardNumberInput.fill("4242424242424242");
	await page
		.getByLabel(/Expiration|Platnost|Datum vypršení/i)
		.or(page.getByPlaceholder(/MM\s*\/\s*(YY|RR)/i))
		.first()
		.fill("1234");
	await page
		.getByRole("textbox", {
			name: /CVC/i,
		})
		.or(page.getByPlaceholder(/CVC/i))
		.first()
		.fill("567");

	await page
		.getByRole("textbox", {
			name: /Cardholder name|Name on card|Jméno na kartě|Jméno držitele karty|Celé jméno/i,
		})
		.or(page.getByPlaceholder(/Celé jméno|Full name/i))
		.first()
		.fill(cardholderName);

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
}

async function signUpBuyer(page: Page) {
	const user = createUser();

	await page.goto("/cs/landing");
	await page.click('[data-action="goto sign-up"]');
	await page.waitForURL("/cs/sign-up");

	await page.locator('[data-ui="SignUpPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignUpPage[PasswordInput]"]').fill(user.password);
	await page.locator('[data-ui="SignUpPage[ConfirmPasswordInput]"]').fill(user.password);
	await page.locator('[data-action="sign up"]').click();
	await page.waitForURL("/cs/app/welcome");

	return user;
}

test("Stripe checkout provisions buyer subscription", async ({ page, database }) => {
	test.skip(!process.env.SERVER_STRIPE_SECRET, "SERVER_STRIPE_SECRET is required");
	test.skip(
		!process.env.SERVER_STRIPE_WEBHOOK_SECRET,
		"SERVER_STRIPE_WEBHOOK_SECRET is required",
	);
	const stripeSecret = process.env.SERVER_STRIPE_SECRET;

	if (!stripeSecret) {
		throw new Error("SERVER_STRIPE_SECRET is required");
	}

	const user = await signUpBuyer(page);

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

	await fillStripeCardForm({
		cardholderName: "Stripe E2E Buyer",
		page,
	});
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

	const subscriptionMapping = await database.kysely
		.selectFrom("user_resource_bundle as urb")
		.innerJoin("user_resource_bundle_stripe as urbs", "urbs.userResourceBundleId", "urb.id")
		.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
		.select([
			"rb.id as resourceBundleId",
			"rb.name",
			"urbs.subscriptionId",
		])
		.where("urb.userId", "=", registeredUser.id)
		.where("rb.name", "=", "package:buyer")
		.executeTakeFirstOrThrow();
	const stripe = new Stripe(stripeSecret);
	const subscription = await stripe.subscriptions.retrieve(subscriptionMapping.subscriptionId);

	expect(subscription.metadata).toMatchObject({
		bundle: subscriptionMapping.name,
		resourceBundleId: subscriptionMapping.resourceBundleId,
		userId: registeredUser.id,
	});
	expect(subscription.metadata.bundleKey).toMatch(/^stripe:checkout:/);
	expect(subscription.metadata.customerId).toBe(subscription.customer);
	expect(subscription.metadata.priceId).toBeTruthy();

	await page.reload();
	await expect(page.locator('[data-ui="BundleItem-[Active]"]').first()).toBeVisible();
	await expect(checkoutButton).toContainText(/active/i);
});

test("Stripe checkout provisions buyer subscription with token upsell", async ({
	appOrigin,
	page,
	database,
}) => {
	test.skip(!process.env.SERVER_STRIPE_SECRET, "SERVER_STRIPE_SECRET is required");
	test.skip(
		!process.env.SERVER_STRIPE_WEBHOOK_SECRET,
		"SERVER_STRIPE_WEBHOOK_SECRET is required",
	);
	const stripeSecret = process.env.SERVER_STRIPE_SECRET;

	if (!stripeSecret) {
		throw new Error("SERVER_STRIPE_SECRET is required");
	}

	const user = await signUpBuyer(page);

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

	await fillStripeCardForm({
		cardholderName: "Stripe E2E Buyer Upsell",
		page,
	});
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

	const stripe = new Stripe(stripeSecret);
	const userStripe = await database.kysely
		.selectFrom("user_stripe")
		.select("customerId")
		.where("userId", "=", registeredUser.id)
		.executeTakeFirstOrThrow();
	const resourceBundle = await database.kysely
		.selectFrom("resource_bundle")
		.select([
			"id",
			"name",
		])
		.where("name", "=", "package:buyer")
		.executeTakeFirstOrThrow();
	const prices = await stripe.prices.list({
		active: true,
		lookup_keys: [
			"item:token-small",
		],
		limit: 2,
	});
	const [upsellPrice] = prices.data;

	if (!upsellPrice) {
		throw new Error("Expected item:token-small Stripe price");
	}

	const bundleKey = `stripe:checkout:upsell-${registeredUser.id}`;
	const upsellSession = await stripe.checkout.sessions.create({
		cancel_url: `${appOrigin}/cs/app/shop?stripe=cancel-upsell`,
		client_reference_id: registeredUser.id,
		customer: userStripe.customerId,
		line_items: [
			{
				price: upsellPrice.id,
				quantity: 1,
			},
		],
		metadata: {
			bundle: resourceBundle.name,
			bundleKey,
			customerId: userStripe.customerId,
			priceId: upsellPrice.id,
			resourceBundleId: resourceBundle.id,
			userId: registeredUser.id,
		},
		mode: "payment",
		success_url: `${appOrigin}/cs/app/shop?stripe=success-upsell`,
	});

	if (!upsellSession.url) {
		throw new Error("Expected Stripe upsell checkout URL");
	}

	await page.goto(upsellSession.url);
	await fillStripeCardForm({
		cardholderName: "Stripe E2E Token Upsell",
		page,
	});
	await page.locator('[data-testid="hosted-payment-submit-button"]').click();
	await page.waitForURL(/\/cs\/app\/shop\?stripe=success-upsell$/);

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
					.where("rb.name", "=", bundleKey)
					.executeTakeFirst();
			},
			{
				timeout: 30_000,
			},
		)
		.toEqual({
			name: bundleKey,
			expiresAt: null,
		});

	const tokenItems = await database.kysely
		.selectFrom("user_resource_bundle as urb")
		.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
		.innerJoin("resource_bundle_item as rbi", "rbi.resourceBundleId", "rb.id")
		.select([
			"rb.name",
			"rbi.amount",
			"rbi.resourceDefinitionId",
		])
		.where("urb.userId", "=", registeredUser.id)
		.where("urb.expiresAt", "is", null)
		.where("rbi.resourceDefinitionId", "=", "item:token-small")
		.orderBy("rb.name", "asc")
		.execute();

	expect(tokenItems).toEqual([
		{
			name: "package:buyer",
			amount: "1.00",
			resourceDefinitionId: "item:token-small",
		},
		{
			name: bundleKey,
			amount: "1.00",
			resourceDefinitionId: "item:token-small",
		},
	]);
});
