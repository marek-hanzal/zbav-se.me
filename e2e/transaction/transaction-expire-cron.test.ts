import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { Effect } from "effect";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { TransactionEntrySensitiveKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntrySensitiveKindEnumSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { leaseTestUserFx, TEST_USER_PASSWORD } from "~/test/user/fx/leaseTestUserFx";
import { expect, test } from "../test";
import { uploadFixtureViaS3 } from "../utils/uploadFixtureViaS3";

const fixturePath = path.resolve(import.meta.dirname, "../fixtures/listing-create-image.jpg");

async function signIn(
	page: Page,
	user: {
		email: string;
	},
) {
	await page.goto("/cs/landing");
	await page.locator('[data-action="goto sign-in"]').click();
	await page.waitForURL("/cs/sign-in");
	await page.locator('[data-ui="SignInPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignInPage[PasswordInput]"]').fill(TEST_USER_PASSWORD);
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
	const { sellerUser, buyerUser } = await Effect.gen(function* () {
		const sellerUser = yield* leaseTestUserFx({
			key: "a",
		});
		const buyerUser = yield* leaseTestUserFx({
			key: "b",
		});

		return {
			sellerUser,
			buyerUser,
		};
	}).pipe(withRuntimeFx(database), Effect.runPromise);

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

	await signIn(page, buyerUser);

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

	await database.kysely
		.insertInto("transaction_entry")
		.values([
			...TransactionEntrySensitiveKindEnumSchema.options.map((kind) => ({
				id: `${transaction.id}-${kind}`,
				transactionId: transaction.id,
				kind,
				userId: buyerUser.id,
				payload: {
					text: kind,
				},
				createdAt: new Date("2026-05-10T03:50:00.000Z"),
			})),
			{
				id: `${transaction.id}-text`,
				transactionId: transaction.id,
				kind: "text" as const,
				userId: buyerUser.id,
				payload: {
					text: "keep me",
				},
				createdAt: new Date("2026-05-10T03:50:00.000Z"),
			},
		])
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
		page.getByText("Automaticky ukončený obchod, dlouho se nic nedělo."),
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

	const remainingKinds = await database.kysely
		.selectFrom("transaction_entry")
		.select("kind")
		.where("transactionId", "=", transaction.id)
		.execute();

	expect(remainingKinds.map(({ kind }) => kind)).not.toEqual(
		expect.arrayContaining(Array.from(TransactionEntrySensitiveKindEnumSchema.options)),
	);
	expect(remainingKinds.map(({ kind }) => kind)).toContain("text");
	expect(remainingKinds.map(({ kind }) => kind)).toContain("status-expired");
});

test("seller sees cron-expired transaction as a system message", async ({
	page,
	database,
	db,
	appOrigin,
}) => {
	const { sellerUser, buyerUser } = await Effect.gen(function* () {
		const sellerUser = yield* leaseTestUserFx({
			key: "a",
		});
		const buyerUser = yield* leaseTestUserFx({
			key: "b",
		});

		return {
			sellerUser,
			buyerUser,
		};
	}).pipe(withRuntimeFx(database), Effect.runPromise);

	const title = `E2E seller expired transaction ${Date.now()}`;
	const upload = await uploadFixtureViaS3({
		database,
		userId: sellerUser.id,
		path: fixturePath,
	});

	const listing = await createListingFx(sellerUser.id, {
		title,
		uploadId: upload.id,
	}).pipe(withRuntimeFx(database), Effect.runPromise);

	const transaction = await transactionCreateFx({
		listingId: listing.id,
		userId: buyerUser.id,
	}).pipe(withRuntimeFx(database), Effect.runPromise);

	await database.kysely
		.updateTable("transaction")
		.set({
			expiresAt: new Date("2026-05-10T03:59:59.000Z"),
		})
		.where("id", "=", transaction.id)
		.execute();

	await signIn(page, sellerUser);

	const cronResponse = await fetch(new URL("/api/cron/04", appOrigin), {
		method: "POST",
		headers: {
			"x-e2e-db": db,
		},
	});

	expect(cronResponse.ok).toBe(true);

	await page.goto(`/cs/app/seller/transaction/${transaction.id}/detail`);
	await expect(
		page.getByText("Automaticky ukončený obchod, dlouho se nic nedělo."),
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
