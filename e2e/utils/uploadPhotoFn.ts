import { setTimeout as delayFn } from "node:timers/promises";
import { stripVTControlCharacters as stripVTControlCharactersFn } from "node:util";
import type { ConsoleMessage, Locator, Page, Response, TestInfo } from "@playwright/test";

export namespace uploadPhotoFn {
	export interface Props {
		page: Page;
		input: Locator;
		filePath: string;
		image: Locator;
		testInfo: TestInfo;
		timeoutMs?: number;
	}

	export interface RpcDiagnostic {
		status: number;
		body: string;
	}
}

export async function uploadPhotoFn({
	page,
	input,
	filePath,
	image,
	testInfo,
	timeoutMs = 30_000,
}: uploadPhotoFn.Props) {
	const appOrigin = new URL(page.url()).origin;
	const deadline = performance.now() + timeoutMs;
	const controller = new AbortController();
	const uploadFailure = Promise.withResolvers<string>();
	const diagnostics: uploadPhotoFn.RpcDiagnostic[] = [];
	const pendingResponses = new Set<Promise<void>>();
	let imageWait: Promise<void> | undefined;
	let failure: Error | undefined;

	const onConsoleFn = (message: ConsoleMessage) => {
		const text = message.text();
		if (
			message.type() === "error" &&
			text.includes("withUploadMutation") &&
			text.includes("Kaboom")
		) {
			uploadFailure.resolve(redactUrlsFn(text).slice(0, 2_048));
		}
	};
	const onResponseFn = (response: Response) => {
		const url = new URL(response.url());
		if (
			response.request().method() !== "POST" ||
			url.origin !== appOrigin ||
			!url.pathname.startsWith("/_serverFn/") ||
			pendingResponses.size >= 4
		) {
			return;
		}

		const diagnostic: uploadPhotoFn.RpcDiagnostic = {
			status: response.status(),
			body: "[Body unavailable]",
		};
		diagnostics.push(diagnostic);
		if (diagnostics.length > 4) diagnostics.shift();

		const pending = readRpcResponseFn(response, diagnostic);
		pendingResponses.add(pending);
		void pending.then(
			() => pendingResponses.delete(pending),
			() => pendingResponses.delete(pending),
		);
	};

	page.on("console", onConsoleFn);
	page.on("response", onResponseFn);
	try {
		await input.setInputFiles(filePath, {
			timeout: timeoutMs,
		});
		imageWait = (async () => {
			while (!controller.signal.aborted) {
				if (performance.now() >= deadline) {
					throw new Error(
						`Uploaded photo did not become visible and load within ${timeoutMs} ms`,
					);
				}
				if (
					(await image.isVisible()) &&
					(await image.evaluateAll((images) => {
						const photo = images[0];
						return (
							images.length === 1 &&
							photo instanceof HTMLImageElement &&
							photo.complete &&
							photo.naturalWidth > 0
						);
					}))
				) {
					return;
				}
				await delayFn(100, undefined, {
					signal: controller.signal,
				});
			}
		})();
		await Promise.race([
			imageWait,
			uploadFailure.promise.then((message) => {
				throw new Error(message);
			}),
		]);
	} catch (error) {
		failure = new Error(
			redactUrlsFn(error instanceof Error ? error.message : String(error)).slice(0, 4_096),
		);
	} finally {
		page.off("console", onConsoleFn);
		page.off("response", onResponseFn);
		controller.abort();
		await Promise.allSettled([
			...(imageWait
				? [
						imageWait,
					]
				: []),
			...pendingResponses,
		]);
	}

	if (failure) {
		const details = JSON.stringify(
			{
				failure: failure.message,
				rpcResponses: diagnostics,
			},
			null,
			2,
		);
		await testInfo.attach("photo-upload-diagnostics", {
			body: details,
			contentType: "application/json",
		});
		throw new Error(
			`Photo upload failed: ${failure.message}\nRecent upload RPC responses:\n${JSON.stringify(diagnostics)}`,
		);
	}
}

async function readRpcResponseFn(response: Response, diagnostic: uploadPhotoFn.RpcDiagnostic) {
	let timer: ReturnType<typeof setTimeout> | undefined;
	try {
		const contentLength = Number(response.headers()["content-length"] ?? 0);
		if (contentLength > 65_536) {
			diagnostic.body = "[Body omitted: exceeds 64 KiB]";
			return;
		}
		const body = await Promise.race([
			response.text(),
			new Promise<string>((resolveFn) => {
				timer = setTimeout(() => resolveFn("[Body unavailable within 2 seconds]"), 2_000);
			}),
		]);
		diagnostic.body = redactUrlsFn(body).slice(0, 2_048);
	} catch {
		diagnostic.body = "[Body could not be read]";
	} finally {
		clearTimeout(timer);
	}
}

function redactUrlsFn(value: string) {
	return stripVTControlCharactersFn(value)
		.replace(/[a-z][a-z\d+.-]*:(?:\\?\/){2}[^\s"'<>]+/gi, "[redacted URL]")
		.replace(/[a-z][a-z\d+.-]*%3a(?:%2f){2}[^\s"'<>]+/gi, "[redacted URL]");
}
