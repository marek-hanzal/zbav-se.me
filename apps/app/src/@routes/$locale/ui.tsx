import { createFileRoute, Outlet } from "@tanstack/react-router";
import { UiPage } from "~/app/@common/nav/page/UiPage";

export const Route = createFileRoute("/$locale/ui")({
	component() {
		return (
			<UiPage>
				<Outlet />
			</UiPage>
		);
	},
});
