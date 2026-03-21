import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSessionFn } from "~/app/@common/auth/getSessionFn";
import { getLocaleFn } from "~/app/@common/locale/getLocaleFn";

export const Route = createFileRoute("/")({
	async loader() {
		const locale = await getLocaleFn();
		const { data: session } = await getSessionFn();

		if (session) {
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
