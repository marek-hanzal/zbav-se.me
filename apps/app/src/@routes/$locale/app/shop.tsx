import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/app/shop")({
	component() {
		return <div>Shop</div>;
	},
});
