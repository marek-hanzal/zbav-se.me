import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "~/app/@user/shop/page/ShopPage";

export const Route = createFileRoute("/$locale/flow/shop")({
	component: ShopPage,
});
