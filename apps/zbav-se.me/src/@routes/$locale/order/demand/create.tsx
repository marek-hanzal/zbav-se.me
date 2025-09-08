import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/order/demand/create")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/$locale/order/demand/create"!</div>;
}
