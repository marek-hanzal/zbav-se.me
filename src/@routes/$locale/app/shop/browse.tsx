import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "~/user/shop/ShopPage/ShopPage";
import { ShopPendingPage } from "~/user/shop/ShopPage/ShopPendingPage";
import { checkoutReturnSyncFn } from "~/user/stripe/fn/checkoutReturnSyncFn";

export const Route = createFileRoute("/$locale/app/shop/browse")({
	async loader() {
		await checkoutReturnSyncFn({
			data: {},
		});
	},
	component() {
		return <ShopPage _suspense="I know" />;
	},
	pendingComponent: ShopPendingPage,
});
