import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { authClient } from "~/app/auth/authClient";

export const getSession = createServerFn({
	method: "GET",
}).handler(async () => {
	return authClient.getSession({
		fetchOptions: {
			headers: getRequestHeaders(),
		},
	});
});

export const Route = createFileRoute("/$locale/app")({
	async loader({ params: { locale } }) {
		const data = await getSession();

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
