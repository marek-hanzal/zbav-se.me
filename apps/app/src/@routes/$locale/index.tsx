import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/")({
	loader({ params: { locale } }) {
		throw redirect({
			to: "/$locale/dashboard",
			params: {
				locale,
			},
		});
	},
});
