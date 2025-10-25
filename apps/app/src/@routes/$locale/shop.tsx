import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/shop")({
	component() {
		return <div>Shop</div>;
	},
});
