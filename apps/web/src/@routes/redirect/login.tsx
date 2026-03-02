import { createFileRoute, redirect } from "@tanstack/react-router";
import { getLocaleFn } from "~/app/locale/getLocaleFn";

export const Route = createFileRoute("/redirect/login")({
	async loader() {
		const locale = await getLocaleFn();

		throw redirect({
			to: "/$locale/login",
			params: {
				locale,
			},
		});
	},
});
