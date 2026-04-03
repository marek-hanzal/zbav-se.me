import { expect, type Page } from "@playwright/test";

export const E2E_LOCALE = "cs";
export const E2E_PASSWORD = "Codex1234!";

export interface BrowserUser {
	email: string;
	password: string;
}

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
