import { createServer, type RequestListener } from "node:http";
import { describe, expect, it, vi } from "vitest";
import { waitForPublicImageFn } from "../../e2e/utils/waitForPublicImageFn";

describe("public fixture image polling", () => {
	it("retries an unavailable image and cancels every unused response body", async () => {
		let requests = 0;
		let closedResponses = 0;
		await withHttpServerFn(
			(_request, response) => {
				requests++;
				response.on("close", () => closedResponses++);
				response.writeHead(requests === 1 ? 503 : 200, {
					"content-type": requests === 1 ? "text/plain" : "image/png",
				});
				// Leave both bodies open: observing close requires the client to cancel them.
				response.write("fixture body");
			},
			async (url) => {
				await waitForPublicImageFn({
					url,
					timeoutMs: 2_000,
					requestTimeoutMs: 500,
					pollIntervalMs: 10,
				});
				expect(requests).toBe(2);
				await vi.waitFor(() => expect(closedResponses).toBe(2));
			},
		);
	});

	it.each([
		{
			requestTimeoutMs: 100,
			minimumRequests: 2,
		},
		{
			requestTimeoutMs: 2_000,
			minimumRequests: 1,
		},
	])(
		"bounds hanging requests with a $requestTimeoutMs ms per-request limit",
		async ({ requestTimeoutMs, minimumRequests }) => {
			let requests = 0;
			let closedResponses = 0;
			await withHttpServerFn(
				(_request, response) => {
					requests++;
					response.on("close", () => closedResponses++);
					// Do not send headers, so fetch itself must be interrupted.
				},
				async (url) => {
					const startedAt = performance.now();
					await expect(
						waitForPublicImageFn({
							url: `${url}?X-Amz-Signature=fixture-secret`,
							timeoutMs: 600,
							requestTimeoutMs,
							pollIntervalMs: 10,
						}),
					).rejects.toThrow(/within 600 ms.*last result: TimeoutError/);
					expect(performance.now() - startedAt).toBeLessThan(2_000);
					expect(requests).toBeGreaterThanOrEqual(minimumRequests);
					await vi.waitFor(() => expect(closedResponses).toBe(requests));
				},
			);
		},
	);

	it("retains the last HTTP failure after a later timeout without exposing the request signature", async () => {
		let requests = 0;
		await withHttpServerFn(
			(_request, response) => {
				if (requests++ > 0) return;
				response.writeHead(404, {
					"content-type": "application/json",
				});
				response.end("{}");
			},
			async (url) => {
				const result = await waitForPublicImageFn({
					url: `${url}?X-Amz-Signature=fixture-secret`,
					timeoutMs: 250,
					pollIntervalMs: 10,
				}).catch((error: unknown) => error);
				expect(result).toBeInstanceOf(Error);
				if (!(result instanceof Error)) {
					throw new Error("Expected image polling to fail");
				}
				expect(result.message).toContain("HTTP 404, content type application/json");
				expect(result.message).toContain("TimeoutError");
				expect(result.message).not.toContain("fixture-secret");
				expect(result.message).not.toContain(url);
			},
		);
	});
});

type HttpTestFn = (url: string) => Promise<void>;

async function withHttpServerFn(handlerFn: RequestListener, testFn: HttpTestFn) {
	const server = createServer(handlerFn);
	await new Promise<void>((resolveFn, rejectFn) => {
		server.once("error", rejectFn);
		server.listen(0, "127.0.0.1", resolveFn);
	});

	try {
		const address = server.address();
		if (address === null || typeof address === "string") {
			throw new Error("Expected a loopback HTTP server");
		}
		await testFn(`http://127.0.0.1:${address.port}`);
	} finally {
		server.closeAllConnections();
		await new Promise<void>((resolveFn, rejectFn) => {
			server.close((error) => (error ? rejectFn(error) : resolveFn()));
		});
	}
}
