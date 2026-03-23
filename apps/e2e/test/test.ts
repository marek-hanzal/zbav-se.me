import type { Page } from "@playwright/test";
import { test as base, expect } from "@playwright/test";

async function waitForViewTransitions(page: Page) {
	await page.waitForFunction(
		() =>
			document.getAnimations().every((animation) => {
				const effect = animation.effect;

				if (!(effect instanceof KeyframeEffect)) {
					return true;
				}

				const pseudoElement = effect.pseudoElement ?? "";

				return (
					!pseudoElement.includes("view-transition") || animation.playState === "finished"
				);
			}),
		{
			timeout: 5_000,
		},
	);

	await page.waitForTimeout(50);
}

export const test = base.extend({
	page: async ({ page }, use) => {
		await use(page);

		if (page.isClosed()) {
			return;
		}

		try {
			await waitForViewTransitions(page);
		} catch {
			// Ignore teardown waits when the page is already navigating away or otherwise unstable.
		}
	},
});

export { expect };
