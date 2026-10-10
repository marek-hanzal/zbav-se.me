import { expect, type Locator } from "@playwright/test";

export async function expectImageLoadedFn(locator: Locator) {
	await expect
		.poll(
			async () =>
				locator.evaluateAll((images) => {
					const image = images[0];

					return (
						images.length === 1 &&
						image instanceof HTMLImageElement &&
						image.complete &&
						image.naturalWidth > 0
					);
				}),
			{
				timeout: 30_000,
				message: "Expected the uploaded image to appear and decode successfully",
			},
		)
		.toBe(true);
	await expect(locator).toBeVisible();
}
