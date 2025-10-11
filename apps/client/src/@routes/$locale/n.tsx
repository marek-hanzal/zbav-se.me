import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "~/app/auth/authClient";

export const Route = createFileRoute("/$locale/n")({
	async loader({ params: { locale } }) {
		const { data } = await authClient.getSession();

		if (!data) {
			throw redirect({
				to: "/$locale/login",
				params: {
					locale,
				},
			});
		}
	},
});
