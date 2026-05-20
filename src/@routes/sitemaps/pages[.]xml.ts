import { createFileRoute } from "@tanstack/react-router";
import { toStreamResponse } from "~/common/sitemap";
import { locales } from "~/locales";
import { withOriginMiddleware } from "~/server/middleware/withOriginMiddleware";

const pages = [
	"/$locale/landing",
	"/$locale/privacy",
	"/$locale/tos",
	"/$locale/sign-in",
	"/$locale/sign-up",
	"/$locale/forgot/password",
] as const;

export const Route = createFileRoute("/sitemaps/pages.xml")({
	server: {
		middleware: [
			withOriginMiddleware,
		],
		handlers: {
			async GET({ context: { origin } }) {
				return toStreamResponse({
					root: "urlset",
					child: "url",
					entries: (async function* () {
						for (const locale of locales) {
							for (const path of pages) {
								yield {
									loc: new URL(
										path.replace("$locale", locale),
										origin,
									).toString(),
								};
							}
						}
					})(),
					cacheControl: "public, max-age=3600, stale-while-revalidate=86400",
				});
			},
		},
	},
});
