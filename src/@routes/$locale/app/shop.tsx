import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ShopPage } from "~/user/shop/ShopPage/ShopPage";
import { checkoutReturnSyncFn } from "~/user/stripe/fn/checkoutReturnSyncFn";
import { ensureCustomerFn } from "~/user/stripe/fn/ensureCustomerFn";

const ShopSearchSchema = z
	.looseObject({
		stripe: z.string().optional(),
		session_id: z.string().optional(),
	})
	.strip();

export const Route = createFileRoute("/$locale/app/shop")({
	validateSearch: ShopSearchSchema,
	loaderDeps({ search }) {
		return search;
	},
	async loader({ deps: search }) {
		if (search.stripe?.startsWith("success")) {
			await checkoutReturnSyncFn({
				data: {
					sessionId: search.session_id,
				},
			});

			return;
		}

		await ensureCustomerFn();
	},
	component() {
		return <ShopPage _suspense="I know" />;
	},
});
