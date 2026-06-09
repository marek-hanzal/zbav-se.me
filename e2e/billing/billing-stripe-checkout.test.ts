import type { Page } from "@playwright/test";
import Stripe from "stripe";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
import { expect, test } from "../test";
import { createUser } from "../utils/createUser";

test.setTimeout(120_000);
test.describe.configure({
	mode: "serial",
});

const STRIPE_E2E_DATABASE_NAME = "e2e-stripe-billing";

test.use({
	dbName: STRIPE_E2E_DATABASE_NAME,
});

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

async function openBuyerBundle(page: Page) {
	if (!new URL(page.url()).pathname.endsWith("/cs/app/shop/browse")) {
		await page.goto("/cs/app/shop/browse");
	}

	const bundleButton = page
		.locator('[data-ui="BundleItem"][data-resource-bundle="package:buyer"]')
		.first();

	await expect(bundleButton).toBeAttached({
		timeout: 30_000,
	});
	await bundleButton.evaluate((element) => {
		element.scrollIntoView({
			block: "center",
			inline: "center",
		});
	});
	await bundleButton.click();
}

async function clickBuyerCheckout(page: Page) {
	await openBuyerBundle(page);

	const checkoutButton = page
		.locator('[data-ui="CheckoutButton"][data-resource-bundle="package:buyer"]')
		.last();

	await expect(checkoutButton).toBeEnabled({
		timeout: 30_000,
	});
	await checkoutButton.click();
}

async function expectBuyerSubscriptionActive(page: Page) {
	await expect(page.locator('[data-ui="BundleItem-[Active]"]').first()).toBeVisible();
	await openBuyerBundle(page);
	await expect(
		page.locator('[data-ui="CancelButton"][data-resource-bundle="package:buyer"]').last(),
	).toContainText(/zrušit|cancel/i);
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

	await clickBuyerCheckout(page);
	await page.waitForURL(/^https:\/\/checkout\.stripe\.com\//);

	await fillStripeCardForm({
		cardholderName: "Stripe E2E Buyer",
		page,
	});
	await page.locator('[data-testid="hosted-payment-submit-button"]').click();
	await page.waitForURL(/\/cs\/app\/shop\/success/);

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

	await page.goto("/cs/app/shop/browse");
	await expectBuyerSubscriptionActive(page);
});

test("Stripe checkout reactivates buyer subscription after external cancellation", async ({
	page,
	database,
}) => {
	const stripeSecret = process.env.SERVER_STRIPE_SECRET;
	const stripeWebhookSecret = process.env.SERVER_STRIPE_WEBHOOK_SECRET;

	if (!stripeSecret) {
		throw new Error("SERVER_STRIPE_SECRET is required");
	}
	if (!stripeWebhookSecret) {
		throw new Error("SERVER_STRIPE_WEBHOOK_SECRET is required");
	}

	const user = await signUpBuyer(page);
	const stripe = new Stripe(stripeSecret);

	const registeredUser = await database.kysely
		.selectFrom("user")
		.select("id")
		.where("email", "=", user.email)
		.executeTakeFirstOrThrow();

	await page.goto("/cs/app/shop/browse");
	await clickBuyerCheckout(page);
	await page.waitForURL(/^https:\/\/checkout\.stripe\.com\//);

	await fillStripeCardForm({
		cardholderName: "Stripe E2E Renewal First",
		page,
	});
	await page.locator('[data-testid="hosted-payment-submit-button"]').click();
	await page.waitForURL(/\/cs\/app\/shop\/success/);

	await expect
		.poll(
			async () => {
				return database.kysely
					.selectFrom("user_resource_bundle as urb")
					.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
					.innerJoin(
						"user_resource_bundle_stripe as urbs",
						"urbs.userResourceBundleId",
						"urb.id",
					)
					.select([
						"urb.expiresAt",
						"urbs.subscriptionId",
					])
					.where("urb.userId", "=", registeredUser.id)
					.where("rb.name", "=", "package:buyer")
					.executeTakeFirst();
			},
			{
				timeout: 30_000,
			},
		)
		.toMatchObject({
			expiresAt: null,
		});

	const firstSubscription = await database.kysely
		.selectFrom("user_resource_bundle as urb")
		.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
		.innerJoin("user_resource_bundle_stripe as urbs", "urbs.userResourceBundleId", "urb.id")
		.select("urbs.subscriptionId")
		.where("urb.userId", "=", registeredUser.id)
		.where("rb.name", "=", "package:buyer")
		.executeTakeFirstOrThrow();

	await stripe.subscriptions.cancel(firstSubscription.subscriptionId);

	/*
	 * The Stripe CLI webhook is still the async production path, but this test runs
	 * against one fixed E2E DB and cannot pretend webhook timing is deterministic.
	 * Opening Billing must reconcile the current customer state before rendering, so
	 * external Dashboard/API cancellation is visible even if the webhook is late.
	 */
	await page.goto("/cs/app/shop/browse");

	await expect
		.poll(
			async () => {
				const bundle = await database.kysely
					.selectFrom("user_resource_bundle as urb")
					.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
					.select("urb.expiresAt")
					.where("urb.userId", "=", registeredUser.id)
					.where("rb.name", "=", "package:buyer")
					.executeTakeFirst();

				return bundle?.expiresAt instanceof Date;
			},
			{
				timeout: 30_000,
			},
		)
		.toBe(true);

	await clickBuyerCheckout(page);
	await page.waitForURL(/^https:\/\/checkout\.stripe\.com\//);

	await fillStripeCardForm({
		cardholderName: "Stripe E2E Renewal Second",
		page,
	});
	await page.locator('[data-testid="hosted-payment-submit-button"]').click();
	await page.waitForURL(/\/cs\/app\/shop\/success/);

	await expect
		.poll(
			async () => {
				return database.kysely
					.selectFrom("user_resource_bundle as urb")
					.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
					.innerJoin(
						"user_resource_bundle_stripe as urbs",
						"urbs.userResourceBundleId",
						"urb.id",
					)
					.select([
						"urb.expiresAt",
						"urbs.subscriptionId",
					])
					.where("urb.userId", "=", registeredUser.id)
					.where("rb.name", "=", "package:buyer")
					.executeTakeFirst();
			},
			{
				timeout: 30_000,
			},
		)
		.toMatchObject({
			expiresAt: null,
		});

	const renewedSubscription = await database.kysely
		.selectFrom("user_resource_bundle as urb")
		.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
		.innerJoin("user_resource_bundle_stripe as urbs", "urbs.userResourceBundleId", "urb.id")
		.select("urbs.subscriptionId")
		.where("urb.userId", "=", registeredUser.id)
		.where("rb.name", "=", "package:buyer")
		.executeTakeFirstOrThrow();

	expect(renewedSubscription.subscriptionId).not.toBe(firstSubscription.subscriptionId);

	await page.goto("/cs/app/shop/browse");
	await expectBuyerSubscriptionActive(page);
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

	await page.goto("/cs/app/shop/browse");
	await clickBuyerCheckout(page);
	await page.waitForURL(/^https:\/\/checkout\.stripe\.com\//);

	await fillStripeCardForm({
		cardholderName: "Stripe E2E Buyer Upsell",
		page,
	});
	await page.locator('[data-testid="hosted-payment-submit-button"]').click();
	await page.waitForURL(/\/cs\/app\/shop\/success/);

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
	const upsellBundle = await database.kysely
		.selectFrom("resource_bundle")
		.select([
			"id",
			"name",
		])
		.where("name", "=", ResourceBundleEnumSchema.enum["extra:token:small"])
		.executeTakeFirstOrThrow();
	const prices = await stripe.prices.list({
		active: true,
		lookup_keys: [
			upsellBundle.name,
		],
		limit: 2,
	});
	const [upsellPrice] = prices.data;

	if (!upsellPrice) {
		throw new Error(
			`Expected ${ResourceBundleEnumSchema.enum["extra:token:small"]} Stripe price`,
		);
	}

	const bundleKey = `stripe:checkout:upsell-${registeredUser.id}`;
	const upsellSession = await stripe.checkout.sessions.create({
		cancel_url: `${appOrigin}/cs/app/shop/cancel`,
		client_reference_id: registeredUser.id,
		customer: userStripe.customerId,
		line_items: [
			{
				price: upsellPrice.id,
				quantity: 1,
			},
		],
		metadata: {
			bundle: upsellBundle.name,
			bundleKey,
			customerId: userStripe.customerId,
			priceId: upsellPrice.id,
			resourceBundleId: upsellBundle.id,
			userId: registeredUser.id,
		},
		mode: "payment",
		success_url: `${appOrigin}/cs/app/shop/success?session_id={CHECKOUT_SESSION_ID}`,
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
	await page.waitForURL(/\/cs\/app\/shop\/success/);

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
		.innerJoin("user_resource_bundle_item as urbi", "urbi.userResourceBundleId", "urb.id")
		.select([
			"rb.name",
			"urbi.amount",
			"urbi.resourceDefinitionId",
		])
		.where("urb.userId", "=", registeredUser.id)
		.where("urb.expiresAt", "is", null)
		.where("urbi.expiresAt", "is", null)
		.where("urbi.resourceDefinitionId", "=", "common:item:token")
		.orderBy("rb.name", "asc")
		.execute();

	expect(tokenItems).toEqual([
		{
			name: "package:buyer",
			amount: "150.00",
			resourceDefinitionId: ResourceDefinitionEnumSchema.enum["common:item:token"],
		},
		{
			name: bundleKey,
			amount: "149.00",
			resourceDefinitionId: ResourceDefinitionEnumSchema.enum["common:item:token"],
		},
	]);
});
