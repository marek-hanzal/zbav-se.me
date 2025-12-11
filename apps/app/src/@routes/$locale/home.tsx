import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/home")({
	component() {
		return (
			<div>
				home, vole
				<Outlet />
			</div>
		);
	},
});
