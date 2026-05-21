import { createFileRoute, redirect } from "@tanstack/react-router";
import { getLocaleFn } from "~/common/locale/getLocaleFn";
import { getSessionFn } from "~/user/auth/fn/getSessionFn";

export const Route = createFileRoute("/")({
	async loader() {
		const locale = await getLocaleFn();
		const session = await getSessionFn();

		if (session?.user) {
			throw redirect({
				to: "/$locale/app/home",
				params: {
					locale,
				},
			});
		}

		throw redirect({
			to: "/$locale/sign-in",
			params: {
				locale,
			},
		});
	},
});
