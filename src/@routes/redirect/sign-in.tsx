import { createFileRoute, redirect } from "@tanstack/react-router";
import { getLocaleFn } from "~/common/locale/getLocaleFn";

export const Route = createFileRoute("/redirect/sign-in")({
	async loader() {
		const locale = await getLocaleFn();

		return redirect({
			to: "/$locale/sign-in",
			params: {
				locale,
			},
		});
	},
});
