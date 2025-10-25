import { createFileRoute, redirect } from "@tanstack/react-router";
import { linkTo } from "@use-pico/common";
import { getSessionFn } from "~/app/auth/getSessionFn";

export const Route = createFileRoute("/$locale/app")({
	async loader({ params: { locale } }) {
		const { data } = await getSessionFn();

		if (!data) {
			throw redirect({
				href: linkTo({
					base: import.meta.env.VITE_WEB_ORIGIN,
					href: "/:locale/login",
					query: {
						locale,
					},
				}),
				statusCode: 302,
			});
		}

		return {
			user: data.user,
		};
	},
});
