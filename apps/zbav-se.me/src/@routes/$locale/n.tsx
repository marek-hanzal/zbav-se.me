import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Layout } from "~/app/ui/layout/Layout";

export const Route = createFileRoute("/$locale/n")({
	component() {
		return (
			<Layout>
				<Outlet />
			</Layout>
		);
	},
});
