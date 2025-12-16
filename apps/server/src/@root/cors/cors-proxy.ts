import type { Routes } from "~/hono/Routes";

export const withCorsProxyApi: Routes.Fn = ({ root }) => {
	root.options("/api/cors-proxy", (c) => {
		c.header("Access-Control-Allow-Origin", "*");
		c.header("Access-Control-Allow-Methods", "GET, OPTIONS");
		c.header("Access-Control-Allow-Headers", "Content-Type");
		return c.body(null, 204);
	});

	root.get("/api/cors-proxy", async (c) => {
		const urlParam = c.req.query("url");
		if (!urlParam) {
			return c.text("Missing ?url=", 400);
		}

		let target: URL;
		try {
			target = new URL(urlParam);
		} catch {
			return c.text("Invalid URL", 400);
		}

		const upstream = await fetch(target.toString(), {
			method: "GET",
			redirect: "follow",
		});

		if (!upstream.ok) {
			return c.text(`Upstream ${upstream.status}`, 502);
		}

		const headers = new Headers();
		headers.set("Access-Control-Allow-Origin", "*");
		headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
		headers.set(
			"Access-Control-Expose-Headers",
			"Content-Type, Content-Length, ETag, Cache-Control",
		);
		headers.set("Cache-Control", "public, max-age=60");

		const contentType = upstream.headers.get("content-type");
		if (contentType) {
			headers.set("Content-Type", contentType);
		}
		const contentLength = upstream.headers.get("content-length");
		if (contentLength) {
			headers.set("Content-Length", contentLength);
		}

		return new Response(upstream.body, {
			status: 200,
			headers,
		});
	});
};
