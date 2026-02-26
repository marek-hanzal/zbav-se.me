import { createFileRoute, redirect } from "@tanstack/react-router";
import { getLocaleFn } from "~/app/v0/@common/locale/getLocaleFn";

export const Route = createFileRoute("/redirect/home")({
	async loader() {
		const locale = await getLocaleFn();

		throw redirect({
			to: "/$locale/home",
			params: {
				locale,
			},
		});
	},
});
