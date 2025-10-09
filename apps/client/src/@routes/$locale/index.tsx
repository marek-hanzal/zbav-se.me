import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/")({
	loader({ params: { locale } }) {
		throw redirect({
			to: "/$locale/n/feed",
			params: {
				locale,
			},
		});
	},
});
