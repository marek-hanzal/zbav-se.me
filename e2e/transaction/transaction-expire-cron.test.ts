import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { Effect } from "effect";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { withTranslatorFx } from "~/translator/server/fx/withTranslatorFx";
import { expect, test } from "../test";
import { uploadFixtureViaS3 } from "../utils/uploadFixtureViaS3";

const seller = {
	email: "expire-seller@x32.cz",
	password: "12345678",
} as const;

const buyer = {
	email: "expire-buyer@x32.cz",
	password: "12345678",
} as const;

const fixturePath = path.resolve(import.meta.dirname, "../fixtures/listing-create-image.jpg");

async function signIn(page: Page, user: typeof seller | typeof buyer) {
	await page.goto("/cs/landing");
	await page.locator('[data-action="goto sign-in"]').click();
	await page.waitForURL("/cs/sign-in");
	await page.locator('[data-ui="SignInPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignInPage[PasswordInput]"]').fill(user.password);
	await page.locator('[data-action="sign in"]').click();
	await page.waitForURL("/cs/app/home");
}

async function expectImageLoaded(locator: Locator) {
	await expect(locator).toBeVisible();
	await expect
		.poll(async () => {
			return locator.evaluate((img) => {
				return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
			});
		})
		.toBe(true);
}

test.setTimeout(120_000);

test("buyer sees cron-expired transaction as a system message", async ({
	page,
	database,
	db,
	appOrigin,
}) => {
	const ath = auth({
		dialect: () => database.dialect,
		translator: await withTranslatorFx({
			locale: "cs",
		}).pipe(withRuntimeFx(database), Effect.runPromise),
	});

	await ath.api.signUpEmail({
		body: {
			name: seller.email,
			email: seller.email,
			password: seller.password,
		},
	});

	await ath.api.signUpEmail({
		body: {
			name: buyer.email,
			email: buyer.email,
			password: buyer.password,
		},
	});

	const sellerUser = await database.kysely
		.selectFrom("user")
		.select("id")
		.where("email", "=", seller.email)
		.executeTakeFirstOrThrow();

	const buyerUser = await database.kysely
		.selectFrom("user")
		.select("id")
		.where("email", "=", buyer.email)
		.executeTakeFirstOrThrow();

	const title = `E2E expired transaction ${Date.now()}`;
	const upload = await uploadFixtureViaS3({
		database,
		userId: sellerUser.id,
		path: fixturePath,
	});

	const listing = await createListingFx(sellerUser.id, {
		title,
		uploadId: upload.id,
	}).pipe(withRuntimeFx(database), Effect.runPromise);

	await signIn(page, buyer);

	await page.locator('[data-action="open listings"]').click();
	await page.waitForURL(/\/cs\/app\/buyer\/feed\/[^/]+\/list$/);

	await expect(page.getByText(title)).toBeVisible();
	await page.locator(`[data-action="open listing detail"][data-id="${listing.id}"]`).click();

	await expect(page.locator('[data-ui="ListingSheet"]')).toBeVisible();
	await expectImageLoaded(page.locator('[data-ui="ListingSheet"] img').first());

	await page.locator('[data-action="create transaction"]').click();
	await expect(page.locator('[data-action="open transactions"]')).toBeVisible();
	await page.locator('[data-action="open transactions"]').click();
	await page.waitForURL(/\/cs\/app\/buyer\/transaction\/[^/]+\/detail$/);

	const transaction = await database.kysely
		.selectFrom("transaction")
		.select("id")
		.where("listingId", "=", listing.id)
		.where("userId", "=", buyerUser.id)
		.executeTakeFirstOrThrow();

	await database.kysely
		.updateTable("transaction")
		.set({
			expiresAt: new Date("2026-05-10T03:59:59.000Z"),
		})
		.where("id", "=", transaction.id)
		.execute();

	const cronResponse = await fetch(new URL("/api/cron/04", appOrigin), {
		method: "POST",
		headers: {
			"x-e2e-db": db,
		},
	});

	expect(cronResponse.ok).toBe(true);

	await page.goto(`/cs/app/buyer/transaction/${transaction.id}/detail`);
	await expect(
		page.getByText("Systém tenhle obchod automaticky ukončil kvůli neaktivitě."),
	).toBeVisible();

	await expect
		.poll(async () => {
			const expiredTransaction = await database.kysely
				.selectFrom("transaction")
				.select("status")
				.where("id", "=", transaction.id)
				.executeTakeFirstOrThrow();

			return expiredTransaction.status;
		})
		.toBe("expired");
});
