import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSessionFn } from "~/app/auth/getSessionFn";
import { getLocaleFn } from "~/app/locale/getLocaleFn";

export const Route = createFileRoute("/")({
	async loader() {
		const { data: session } = await getSessionFn();
		const locale = await getLocaleFn();

		if (session) {
			throw redirect({
				to: "/$locale/app/dashboard",
				params: {
					locale,
				},
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
