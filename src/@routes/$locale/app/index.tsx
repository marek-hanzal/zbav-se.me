import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/app/")({
	loader({ params: { locale } }) {
		throw redirect({
			to: "/$locale/app/home",
			params: {
				locale,
			},
		});
	},
});
