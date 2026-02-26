import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "~/app/v0/@user/shop/page/ShopPage";

export const Route = createFileRoute("/$locale/shop")({
	component: ShopPage,
});
