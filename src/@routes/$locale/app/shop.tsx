import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "~/user/shop/ShopPage/ShopPage";
import { ensureCustomerFn } from "~/user/stripe/fn/ensureCustomerFn";

export const Route = createFileRoute("/$locale/app/shop")({
	async loader() {
		await ensureCustomerFn();
	},
	component() {
		return <ShopPage _suspense="I know" />;
	},
});
