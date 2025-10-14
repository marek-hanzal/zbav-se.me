import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSessionFn } from "~/app/auth/getSessionFn";

export const Route = createFileRoute("/$locale/app")({
	async loader({ params: { locale } }) {
		console.log("app.loader", import.meta.env.VITE_API);

		const { data } = await getSessionFn();

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
