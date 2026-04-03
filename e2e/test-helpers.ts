import { expect, type Page } from "@playwright/test";
import { Effect } from "effect";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";
import type { testabase } from "./testabase";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

export const E2E_LOCALE = "cs";
export const E2E_PASSWORD = "Codex1234!";

export interface BrowserUser {
	email: string;
	password: string;
}
type BuyerInboxType = "buyer-message";
export type SeededDraft = Awaited<ReturnType<typeof draftCreateFx>>;
export type SeededTransaction = Awaited<ReturnType<typeof transactionCreateFx>>;

export function createBrowserUser(prefix: string): BrowserUser {
	return {
		email: `${prefix}-${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}@x32.cz`,
		password: E2E_PASSWORD,
	};
}

export async function signUp(page: Page, user: BrowserUser) {
	await page.goto(`/${E2E_LOCALE}/sign-up`);
	await page.locator('[data-ui="SignUpPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignUpPage[PasswordInput]"]').fill(user.password);
	await page.locator('[data-ui="SignUpPage[ConfirmPasswordInput]"]').fill(user.password);
	await page.locator('[data-action="sign up"]').click();
	await page.waitForURL(`**/${E2E_LOCALE}/app/welcome`);
	await expect(page.locator('[data-ui="WelcomePage[Container]"]')).toBeVisible();
}

export async function waitForWelcome(page: Page) {
	await expect(page).toHaveURL(new RegExp(`/${E2E_LOCALE}/app/welcome$`));
	await expect(page.locator('[data-ui="WelcomePage[Container]"]')).toBeVisible();
}

export async function signIn(page: Page, user: BrowserUser) {
	await page.goto(`/${E2E_LOCALE}/sign-in`);
	await page.locator('[data-ui="SignInPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignInPage[PasswordInput]"]').fill(user.password);
	await page.locator('[data-action="sign in"]').click();
	await page.waitForURL(`**/${E2E_LOCALE}/app/home`);
}

export async function signOut(page: Page) {
	await page.goto(`/${E2E_LOCALE}/app/user`);
	await expect(page.locator('[data-ui="Status-[Container.action]"]')).toBeVisible();
	await page.locator('[data-ui="Status-[Container.action]"] button').click();
	await page.waitForURL(`**/${E2E_LOCALE}/landing`);
	await page.context().clearCookies();
	await page.evaluate(() => {
		localStorage.clear();
		sessionStorage.clear();
	});
}

export async function getUserIdByEmail(database: TestDatabase, email: string) {
	return Effect.gen(function* () {
		const user = yield* Effect.promise(() =>
			database.kysely
				.selectFrom("user")
				.select([
					"id",
				])
				.where("email", "=", email)
				.executeTakeFirstOrThrow(),
		);

		return user.id;
	}).pipe(withRuntimeFx(database), Effect.runPromise);
}

export async function seedPublishableDraft(database: TestDatabase, userId: string, title: string) {
	return Effect.gen(function* () {
		const category = yield* Effect.promise(() =>
			database.kysely
				.selectFrom("category")
				.select([
					"id",
				])
				.where("locale", "=", "cs")
				.orderBy("sort", "asc")
				.executeTakeFirstOrThrow(),
		);

		const location = yield* Effect.promise(() =>
			database.kysely
				.selectFrom("location")
				.select([
					"id",
				])
				.where("id", "=", "loc_test_praha")
				.executeTakeFirstOrThrow(),
		);

		const upload = yield* uploadCreateFx({
			userId,
			url: `https://cdn.zbav-se.me/e2e/${crypto.randomUUID()}.jpg`,
		});

		return yield* draftCreateFx({
			userId,
			title,
			description: "A compact test listing.",
			price: 1234,
			priceType: "closed",
			delivery: [
				"personal",
			],
			warranty: "no-warranty",
			restriction: "none",
			locationId: location.id,
			categoryId: category.id,
			expiresAt: "7-days",
			pros: [
				"Useful",
			],
			cons: [
				"Plain",
			],
			uploadIds: [
				upload.id,
			],
		});
	}).pipe(withRuntimeFx(database), Effect.runPromise);
}

export async function seedBuyerTransaction(database: TestDatabase, listingId: string) {
	return Effect.gen(function* () {
		const buyer = yield* leaseTestUserFx({});

		return yield* transactionCreateFx({
			userId: buyer.id,
			listingId,
		});
	}).pipe(withRuntimeFx(database), Effect.runPromise);
}

export async function waitForListingByDraftId(database: TestDatabase, draftId: string) {
	return waitForRow(
		database,
		() =>
			database.kysely
				.selectFrom("listing")
				.select([
					"id",
				])
				.where("draftId", "=", draftId)
				.executeTakeFirst(),
		"Listing was not created in time.",
	);
}

export async function waitForLatestInboxByUserId(
	database: TestDatabase,
	userId: string,
	type: BuyerInboxType,
) {
	return waitForRow(
		database,
		() =>
			database.kysely
				.selectFrom("inbox")
				.select([
					"archivedAt",
					"id",
				])
				.where("userId", "=", userId)
				.where("type", "=", type)
				.orderBy("timestamp", "desc")
				.executeTakeFirst(),
		"Inbox row was not created in time.",
	);
}

async function waitForRow<T>(
	database: TestDatabase,
	selectRow: () => Promise<T | undefined>,
	errorMessage: string,
) {
	return Effect.gen(function* () {
		for (let index = 0; index < 20; index += 1) {
			const row = yield* Effect.promise(selectRow);

			if (row) {
				return row;
			}

			yield* Effect.promise(() => new Promise((resolve) => setTimeout(resolve, 250)));
		}

		throw new Error(errorMessage);
	}).pipe(withRuntimeFx(database), Effect.runPromise);
}
