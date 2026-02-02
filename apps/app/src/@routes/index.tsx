import { createFileRoute, redirect } from "@tanstack/react-router";
import { linkTo } from "@use-pico/common/link-to";
import { getSessionFn } from "~/app/@common/auth/getSessionFn";
import { getLocaleFn } from "~/app/locale/getLocaleFn";

export const Route = createFileRoute("/")({
	async loader() {
		const { data: session } = await getSessionFn();
		const locale = await getLocaleFn();

		if (session) {
			throw redirect({
				to: "/$locale/ui/home",
				params: {
					locale,
				},
			});
		}

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
	},
});
