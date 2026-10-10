import path from "node:path";
import type { Locator, Page } from "@playwright/test";
import { Effect } from "effect";
import { transactionCreateFx } from "~/buyer-transaction/fx/transactionCreateFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { leaseTestUserFx, TEST_USER_PASSWORD } from "~/test/user/fx/leaseTestUserFx";
import { TransactionEntrySensitiveKindEnumSchema } from "~/transaction-contract/schema/TransactionEntrySensitiveKindEnumSchema";
import { expect, testFn } from "../testFn";
import { uploadFixtureViaS3Fn } from "../utils/uploadFixtureViaS3Fn";

const fixturePath = path.resolve(import.meta.dirname, "../fixtures/listing-create-image.jpg");

function cronHeadersFn(db: string) {
	const token = process.env.SERVER_CRON_TOKEN;

	if (!token) {
		throw new Error("SERVER_CRON_TOKEN is required for cron e2e tests");
	}

	return {
		authorization: `Bearer ${token}`,
		"x-e2e-db": db,
	};
}

async function signInFn(
	page: Page,
	user: {
		email: string;
	},
) {
	await page.goto("/cs/landing");
	await page.locator('[data-action="goto sign-in"]').click();
	await page.waitForURL("/cs/sign-in");
	await page.locator('[data-ui="SignIn-[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignIn-[PasswordInput]"]').fill(TEST_USER_PASSWORD);
	await page.locator('[data-action="sign in"]').click();
	await page.waitForURL("/cs/app/home");
}

async function expectImageLoadedFn(locator: Locator) {
	await expect(locator).toBeVisible();
	await expect
		.poll(async () => {
			return locator.evaluate((img) => {
				return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0;
			});
		})
		.toBe(true);
}

testFn.setTimeout(120_000);

testFn(
	"buyer sees cron-expired transaction as a system message",
	async ({ page, database, db, appOrigin }) => {
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
		}).pipe(withRuntimeFn(database), Effect.runPromise);

		const title = `E2E expired transaction ${Date.now()}`;
		const upload = await uploadFixtureViaS3Fn({
			database,
			userId: sellerUser.id,
			path: fixturePath,
		});

		const listing = await createListingFx(sellerUser.id, {
			title,
			uploadId: upload.id,
		}).pipe(withRuntimeFn(database), Effect.runPromise);

		await signInFn(page, buyerUser);

		await page.locator('[data-action="open listings"]').click();
		await page.waitForURL(/\/cs\/app\/buyer\/feed\/[^/]+\/list$/);

		await expect(page.getByText(title)).toBeVisible();
		await page.locator(`[data-action="open listing detail"][data-id="${listing.id}"]`).click();

		await expect(page.locator('[data-ui="ListingSheet[BottomSheet]"]')).toBeVisible();
		await expectImageLoadedFn(
			page.locator('[data-ui="ListingSheet[BottomSheet]"] img').first(),
		);

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
			headers: cronHeadersFn(db),
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
	},
);

testFn(
	"seller sees cron-expired transaction as a system message",
	async ({ page, database, db, appOrigin }) => {
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
		}).pipe(withRuntimeFn(database), Effect.runPromise);

		const title = `E2E seller expired transaction ${Date.now()}`;
		const upload = await uploadFixtureViaS3Fn({
			database,
			userId: sellerUser.id,
			path: fixturePath,
		});

		const listing = await createListingFx(sellerUser.id, {
			title,
			uploadId: upload.id,
		}).pipe(withRuntimeFn(database), Effect.runPromise);

		const transaction = await transactionCreateFx({
			listingId: listing.id,
			userId: buyerUser.id,
		}).pipe(withRuntimeFn(database), Effect.runPromise);

		await database.kysely
			.updateTable("transaction")
			.set({
				expiresAt: new Date("2026-05-10T03:59:59.000Z"),
			})
			.where("id", "=", transaction.id)
			.execute();

		await signInFn(page, sellerUser);

		const cronResponse = await fetch(new URL("/api/cron/04", appOrigin), {
			method: "POST",
			headers: cronHeadersFn(db),
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
	},
);
