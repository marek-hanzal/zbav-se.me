import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Layout } from "~/app/ui/layout/Layout";
import { Nav } from "~/app/ui/nav/Nav";

export const Route = createFileRoute("/$locale/n")({
	component() {
		return (
			<Layout>
				<div className="flex-1">
					<Outlet />
				</div>

				<Nav />
			</Layout>
		);
	},
});
