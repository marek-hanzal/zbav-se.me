import path from "node:path";
import type { Page } from "@playwright/test";
import { expect, testFn } from "../testFn";
import { uploadPhotoFn } from "../utils/uploadPhotoFn";

const fixturePath = path.resolve(import.meta.dirname, "../fixtures/listing-create-image.jpg");
const imageDataUrl =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";

testFn("photo upload helper waits for a visible loaded image", async ({ page }, testInfo) => {
	await preparePhotoInputFn(page);
	await page.locator("#photo").evaluate((input, src) => {
		input.addEventListener("change", () => {
			const image = document.querySelector("img");
			if (image) image.src = src;
		});
	}, imageDataUrl);

	await uploadPhotoFn({
		page,
		input: page.locator("#photo"),
		filePath: fixturePath,
		image: page.locator("#uploaded"),
		testInfo,
	});
	await expect(page.locator("#uploaded")).toBeVisible();
});

testFn(
	"photo upload helper exposes RPC failures without leaking signed URLs",
	async ({ page }, testInfo) => {
		const signedUrl = "https://example.invalid/photo?X-Amz-Signature=secret-upload-signature";
		await preparePhotoInputFn(page);
		await page.route("**/_serverFn/upload-helper", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					error: "The specified bucket does not exist.",
					url: signedUrl,
					encodedUrl: encodeURIComponent(signedUrl),
				}),
			});
		});
		await page.locator("#photo").evaluate((input) => {
			input.addEventListener("change", () => {
				void fetch("/_serverFn/upload-helper", {
					method: "POST",
				}).then(async (response) => {
					await response.text();
					console.error("[withUploadMutation] Kaboom");
				});
			});
		});

		const startedAt = performance.now();
		const failure = await uploadPhotoFn({
			page,
			input: page.locator("#photo"),
			filePath: fixturePath,
			image: page.locator("#uploaded"),
			testInfo,
			timeoutMs: 10_000,
		}).then(
			() => undefined,
			(error: unknown) => error,
		);
		if (!(failure instanceof Error))
			throw new Error("Expected the helper to expose the upload failure");

		expect(performance.now() - startedAt).toBeLessThan(5_000);
		expect(failure.message).toContain("The specified bucket does not exist.");
		expect(failure.message).not.toContain("secret-upload-signature");
		const diagnostic = testInfo.attachments.find(
			({ name }) => name === "photo-upload-diagnostics",
		);
		const body = diagnostic?.body?.toString();
		expect(body).toContain("The specified bucket does not exist.");
		expect(body).toContain("[redacted URL]");
		expect(body).not.toContain("secret-upload-signature");
		expect(body).not.toContain("example.invalid");

		await page.setContent(
			'<input id="photo" type="file"><img id="uploaded" width="32" height="32">',
		);
		await page.locator("#photo").evaluate((input, src) => {
			input.addEventListener("change", () => {
				const image = document.querySelector("img");
				if (image) image.src = src;
				console.error("[unrelatedMutation] Kaboom");
			});
		}, imageDataUrl);
		await uploadPhotoFn({
			page,
			input: page.locator("#photo"),
			filePath: fixturePath,
			image: page.locator("#uploaded"),
			testInfo,
		});
	},
);

async function preparePhotoInputFn(page: Page) {
	await page.route("**/__e2e_upload-helper", async (route) => {
		await route.fulfill({
			contentType: "text/html",
			body: '<input id="photo" type="file"><img id="uploaded" width="32" height="32">',
		});
	});
	await page.goto("/__e2e_upload-helper");
}
