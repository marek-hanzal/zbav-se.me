import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/n/create/$categoryGroupId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/$locale/n/create/$categoryGroupId"!</div>;
}
