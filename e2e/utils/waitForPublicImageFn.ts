import { setTimeout as delay } from "node:timers/promises";

export namespace waitForPublicImageFn {
	export interface Props {
		url: string;
		timeoutMs?: number;
		requestTimeoutMs?: number;
		pollIntervalMs?: number;
	}
}

export async function waitForPublicImageFn({
	url,
	timeoutMs = 30_000,
	requestTimeoutMs = 2_000,
	pollIntervalMs = 500,
}: waitForPublicImageFn.Props) {
	if (
		[
			timeoutMs,
			requestTimeoutMs,
			pollIntervalMs,
		].some((value) => !Number.isFinite(value) || value <= 0)
	) {
		throw new Error("Image polling timeouts and interval must be positive finite numbers");
	}

	const deadline = performance.now() + timeoutMs;
	let attempts = 0;
	let lastResult = "No response received";
	let lastResponse: string | undefined;

	while (performance.now() < deadline) {
		let response: Response | undefined;
		attempts++;
		try {
			response = await fetch(url, {
				cache: "no-store",
				signal: AbortSignal.timeout(
					Math.max(
						1,
						Math.ceil(Math.min(requestTimeoutMs, deadline - performance.now())),
					),
				),
			});
			const contentType = response.headers.get("content-type");
			lastResult = `HTTP ${response.status}, content type ${contentType ?? "missing"}`;
			lastResponse = lastResult;
			if (response.ok && contentType?.startsWith("image/")) {
				return;
			}
		} catch (error) {
			lastResult =
				error instanceof Error
					? `${error.name}: ${error.message}`
					: "Unknown request error";
		} finally {
			await response?.body?.cancel().catch(() => undefined);
		}

		const remainingMs = deadline - performance.now();
		if (remainingMs > 0) {
			await delay(Math.min(pollIntervalMs, remainingMs));
		}
	}

	if (lastResponse && lastResponse !== lastResult) {
		lastResult += `; last HTTP response: ${lastResponse}`;
	}
	const detail = lastResult
		.replaceAll(url, "[request URL]")
		.replace(/https?:\/\/\S+/g, "[request URL]");
	throw new Error(
		`Uploaded image did not become publicly available within ${timeoutMs} ms after ${attempts} requests; last result: ${detail}`,
	);
}
