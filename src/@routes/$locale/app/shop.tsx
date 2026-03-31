import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "~/user/shop/ShopPage/ShopPage";

export const Route = createFileRoute("/$locale/app/shop")({
	component: ShopPage,
});
