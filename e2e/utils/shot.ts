import type { Page, TestInfo } from "@playwright/test";

export async function shot(page: Page, testInfo: TestInfo, name: string) {
	const screenshotPath = testInfo.outputPath("milestones", `${name}.png`);

	await page.screenshot({
		path: screenshotPath,
	});

	await testInfo.attach(name, {
		path: screenshotPath,
		contentType: "image/png",
	});
}
