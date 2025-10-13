import { createFileRoute, Outlet } from "@tanstack/react-router";
import { translator } from "@use-pico/common";

export const Route = createFileRoute("/$locale")({
	async loader({ params: { locale } }) {
		return (await import(`../translation/${locale}.yaml`)).default;
	},
	staleTime: 1000 * 60 * 60,
	component() {
		/**
		 * Ugly as hell, but for now I don't have better solution how to do this
		 * both on server and client side.
		 *
		 * The core idea is this route won't re-render, to it's quite safe to use it
		 * this way (out of effect and so on).
		 */
		translator.push(Route.useLoaderData());

		return <Outlet />;
	},
});
