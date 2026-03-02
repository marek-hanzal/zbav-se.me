import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "~/app/@user/shop/~public/ShopPage";

export const Route = createFileRoute("/$locale/shop")({
	component: ShopPage,
});
