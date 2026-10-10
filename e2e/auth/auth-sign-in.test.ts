import { Effect } from "effect";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { leaseTestUserFx, TEST_USER_PASSWORD } from "~/test/user/fx/leaseTestUserFx";
import { expect, testFn } from "../testFn";

testFn("auth sign in", async ({ page, database }) => {
	const user = await leaseTestUserFx({
		key: "a",
	}).pipe(withRuntimeFn(database), Effect.runPromise);

	await page.goto("/cs/app/home");

	await page.waitForURL(/\/cs\/sign-in(?:\?.*)?$/);

	await page.goto("/cs/landing");
	await page.click('[data-action="goto sign-in"]');

	await page.waitForURL(/\/cs\/sign-in(?:\?.*)?$/);

	await page.locator('[data-ui="SignIn-[EmailInput]"]').fill(user.email);
	await page.locator('[data-ui="SignIn-[PasswordInput]"]').fill(TEST_USER_PASSWORD);
	await page.locator('[data-action="sign in"]').click();

	await page.waitForURL("/cs/app/home");

	await expect(page.locator('[data-ui="HomeMenu[Container]"]')).toBeVisible();
});
