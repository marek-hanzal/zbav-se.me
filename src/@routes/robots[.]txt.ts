import { createFileRoute } from "@tanstack/react-router";
import { pathOf } from "~/common/route/pathOf";
import { withOriginMiddleware } from "~/server/middleware/withOriginMiddleware";

const blocked = [
	"/api",
	"/mcp",
	"/redirect",
	"/*/status/",
	"/*/app/",
] as const;

export const Route = createFileRoute("/robots.txt")({
	server: {
		middleware: [
			withOriginMiddleware,
		],
		handlers: {
			async GET({ context: { origin } }) {
				return new Response(
					[
						"User-agent: *",
						"Allow: /",
						...blocked.map((rule) => {
							return `Disallow: ${rule}`;
						}),
						`Sitemap: ${new URL(pathOf("/sitemap.xml"), origin).toString()}`,
					].join("\n"),
					{
						headers: {
							"cache-control": "public, max-age=3600, stale-while-revalidate=86400",
							"content-type": "text/plain; charset=utf-8",
						},
					},
				);
			},
		},
	},
});
