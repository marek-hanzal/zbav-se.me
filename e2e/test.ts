import path from "node:path";
import type { Page } from "@playwright/test";
import { test as base, expect } from "@playwright/test";
import { testabase } from "./testabase";

async function waitForViewTransitions(page: Page) {
	await page.waitForFunction(
		() => {
			return document.getAnimations().every((animation) => {
				const effect = animation.effect;

				if (!(effect instanceof KeyframeEffect)) {
					return true;
				}

				const pseudoElement = effect.pseudoElement ?? "";

				return (
					!pseudoElement.includes("view-transition") || animation.playState === "finished"
				);
			});
		},
		{
			timeout: 5_000,
		},
	);

	await page.waitForTimeout(50);
}

function toDatabaseName(file: string, title: string, workerIndex: number, retry: number) {
	const fileName = path.basename(file, path.extname(file));
	const rawName = [
		fileName,
		title,
		`w${workerIndex}`,
		`r${retry}`,
	]
		.join("-")
		.toLowerCase()
		.replace(/[^a-z0-9_-]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-+|-+$/g, "");

	return `e2e-${rawName || "test"}`.slice(0, 63);
}

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

export const test = base.extend<{
	db: string;
	database: TestDatabase;
}>({
	// biome-ignore lint/correctness/noEmptyPattern: Ssst
	async db({}, use, testInfo) {
		await use(
			toDatabaseName(testInfo.file, testInfo.title, testInfo.workerIndex, testInfo.retry),
		);
	},
	async database({ db }, use) {
		let cleanup = async () => {};

		const database = await testabase({
			name: db,
			onTestFinished(callbackFn) {
				cleanup = callbackFn;
			},
		});

		await use(database);

		await cleanup();
	},
	async page({ page, db }, use) {
		await page.context().setExtraHTTPHeaders({
			"x-e2e-db": db,
		});

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
