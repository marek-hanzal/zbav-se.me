import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "~/user/shop/~public/ShopPage";

export const Route = createFileRoute("/$locale/app/shop")({
	component: ShopPage,
});
