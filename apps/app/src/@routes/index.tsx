import { createFileRoute, redirect } from "@tanstack/react-router";
import { linkTo } from "@use-pico/common/link-to";
import { getSessionFn } from "~/app/@common/auth/getSessionFn";
import { getLocaleFn } from "~/app/@common/locale/getLocaleFn";

export const Route = createFileRoute("/")({
	async loader() {
		const { data: session } = await getSessionFn();

		if (session) {
			throw redirect({
				to: "/redirect/home",
			});
		}

		const locale = await getLocaleFn();

		throw redirect({
			href: linkTo({
				base: import.meta.env.VITE_WEB_ORIGIN,
				href: "/redirect/login",
				query: {
					locale,
				},
			}),
			statusCode: 302,
		});
	},
});
