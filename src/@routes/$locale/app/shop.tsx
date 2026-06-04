import { createFileRoute } from "@tanstack/react-router";
import { ensureCustomerFn } from "~/user/stripe/fn/ensureCustomerFn";
import { ShopPage } from "~/user/shop/ShopPage/ShopPage";

export const Route = createFileRoute("/$locale/app/shop")({
	async loader() {
		await ensureCustomerFn();
	},
	component() {
		return <ShopPage _suspense="I know" />;
	},
});
