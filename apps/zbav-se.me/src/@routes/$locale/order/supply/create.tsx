import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/order/supply/create")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/$locale/order/supply/create"!</div>;
}
