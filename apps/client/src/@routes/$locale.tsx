import { createFileRoute, Outlet } from "@tanstack/react-router";
import { translator } from "@use-pico/common";

export const Route = createFileRoute("/$locale")({
	async loader({ params: { locale } }) {
		const dict = (await import(`../translation/${locale}.yaml`)).default;

		translator.push(dict);

		return dict;
	},
	component() {
		const translations = Route.useLoaderData();
		translator.push(translations);

		return <Outlet />;
	},
});
