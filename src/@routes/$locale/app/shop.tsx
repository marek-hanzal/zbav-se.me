import { createFileRoute } from "@tanstack/react-router";
import { billingCustomerEnsureFn } from "~/user/stripe/fn/billingCustomerEnsureFn";
import { ShopPage } from "~/user/shop/ShopPage/ShopPage";

export const Route = createFileRoute("/$locale/app/shop")({
	async loader() {
		await billingCustomerEnsureFn();
	},
	component() {
		return <ShopPage _suspense="I know" />;
	},
});
