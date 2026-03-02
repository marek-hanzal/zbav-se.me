import { createFileRoute, redirect } from "@tanstack/react-router";
import { linkTo } from "@use-pico/common/link-to";
import { getSessionFn } from "~/app/auth/getSessionFn";
import { getLocaleFn } from "~/app/locale/getLocaleFn";

export const Route = createFileRoute("/")({
	async loader() {
		const { data: session } = await getSessionFn();
		const locale = await getLocaleFn();

		if (session) {
			throw redirect({
				href: linkTo({
					base: import.meta.env.VITE_APP_ORIGIN,
					href: "/redirect/home",
					query: {
						locale,
					},
				}),
				statusCode: 302,
			});
		}

		throw redirect({
			to: "/$locale/landing",
			params: {
				locale,
			},
		});
	},
});
