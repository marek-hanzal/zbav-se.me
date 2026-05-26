import { Effect } from "effect";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { leaseTestUserFx, TEST_USER_PASSWORD } from "~/test/user/fx/leaseTestUserFx";
import { expect, test } from "../test";

test("auth sign in", async ({ page, database }) => {
	const user = await leaseTestUserFx({
		key: "a",
	}).pipe(withRuntimeFx(database), Effect.runPromise);

	await page.goto("/cs/app/home");

	await page.waitForURL(/\/cs\/sign-in(?:\?.*)?$/);

	await page.goto("/cs/landing");
	await page.click('[data-action="goto sign-in"]');

	await page.waitForURL(/\/cs\/sign-in(?:\?.*)?$/);

	await page.locator('[data-ui="SignInPage[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignInPage[PasswordInput]"]').fill(TEST_USER_PASSWORD);
	await page.locator('[data-action="sign in"]').click();

	await page.waitForURL("/cs/app/home");

	await expect(page.locator('[data-ui="HomeMenu"]')).toBeVisible();
});
