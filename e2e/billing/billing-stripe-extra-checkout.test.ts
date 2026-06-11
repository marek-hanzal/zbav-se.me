import type { Page } from "@playwright/test";
import Stripe from "stripe";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
import { expect, test } from "../test";
import { createUser } from "../utils/createUser";

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

async function openExtraBundle(page: Page, bundle: ResourceBundleEnumSchema.Type) {
	if (!new URL(page.url()).pathname.endsWith("/cs/app/shop/browse")) {
		await page.goto("/cs/app/shop/browse");
	}

	const bundleButton = page
		.locator(`[data-ui="ExtraItem"][data-resource-bundle="${bundle}"]`)
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

async function clickExtraCheckout(page: Page, bundle: ResourceBundleEnumSchema.Type) {
	await openExtraBundle(page, bundle);

	const checkoutButton = page
		.locator(`[data-ui="ExtraCheckoutButton"][data-resource-bundle="${bundle}"]`)
		.last();

	await expect(checkoutButton).toBeEnabled({
		timeout: 30_000,
	});
	await checkoutButton.click();
}

test("Stripe checkout provisions standalone token extra payment", async ({ page, database }) => {
	test.skip(!process.env.SERVER_STRIPE_SECRET, "SERVER_STRIPE_SECRET is required");
	test.skip(
		!process.env.SERVER_STRIPE_WEBHOOK_SECRET,
		"SERVER_STRIPE_WEBHOOK_SECRET is required",
	);
	const stripeSecret = process.env.SERVER_STRIPE_SECRET;

	if (!stripeSecret) {
		throw new Error("SERVER_STRIPE_SECRET is required");
	}

	const extraBundle = ResourceBundleEnumSchema.enum["extra:token:small"];
	const user = await signUpBuyer(page);

	const registeredUser = await database.kysely
		.selectFrom("user")
		.select("id")
		.where("email", "=", user.email)
		.executeTakeFirstOrThrow();

	await clickExtraCheckout(page, extraBundle);
	await page.waitForURL(/^https:\/\/checkout\.stripe\.com\//);

	await fillStripeCardForm({
		cardholderName: "Stripe E2E Token Extra",
		page,
	});
	await page.locator('[data-testid="hosted-payment-submit-button"]').click();
	await page.waitForURL(/\/cs\/app\/shop\/success/);

	const sessionId = new URL(page.url()).searchParams.get("session_id");

	expect(sessionId).toBeTruthy();
	if (!sessionId) {
		throw new Error("Expected Stripe checkout session_id in success URL");
	}

	const stripe = new Stripe(stripeSecret);
	const session = await stripe.checkout.sessions.retrieve(sessionId);

	expect(session.mode).toBe("payment");
	expect(session.payment_status).toBe("paid");
	expect(session.metadata).toMatchObject({
		bundle: extraBundle,
		userId: registeredUser.id,
	});
	expect(session.metadata?.bundleKey).toMatch(/^stripe:checkout:/);
	expect(session.metadata?.customerId).toBe(session.customer);
	expect(session.metadata?.priceId).toBeTruthy();

	const bundleKey = session.metadata?.bundleKey;

	if (!bundleKey) {
		throw new Error("Expected Stripe checkout bundleKey metadata");
	}

	await expect
		.poll(
			async () => {
				return database.kysely
					.selectFrom("user_resource_bundle as urb")
					.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
					.innerJoin(
						"user_resource_bundle_item as urbi",
						"urbi.userResourceBundleId",
						"urb.id",
					)
					.innerJoin(
						"user_resource_bundle_item_stripe as urbis",
						"urbis.userResourceBundleItemId",
						"urbi.id",
					)
					.select([
						"rb.name",
						"rb.type",
						"rb.access",
						"urb.expiresAt",
						"urbi.amount",
						"urbi.resourceDefinitionId",
						"urbis.key",
					])
					.where("urb.userId", "=", registeredUser.id)
					.where("rb.name", "=", bundleKey)
					.where("urb.expiresAt", "is", null)
					.where("urbi.expiresAt", "is", null)
					.where("urbi.resourceDefinitionId", "=", "common:item:token")
					.executeTakeFirst();
			},
			{
				timeout: 30_000,
			},
		)
		.toEqual({
			name: bundleKey,
			type: "extra",
			access: "protected",
			expiresAt: null,
			amount: "149.00",
			resourceDefinitionId: ResourceDefinitionEnumSchema.enum["common:item:token"],
			key: bundleKey,
		});

	const subscriptionMappings = await database.kysely
		.selectFrom("user_resource_bundle as urb")
		.innerJoin("user_resource_bundle_stripe as urbs", "urbs.userResourceBundleId", "urb.id")
		.select("urbs.subscriptionId")
		.where("urb.userId", "=", registeredUser.id)
		.execute();

	expect(subscriptionMappings).toEqual([]);
});
