import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { billingInfoFn } from "../fn/billingInfoFn";
import type { BillingInfoSchema } from "../server/schema/BillingInfoSchema";

export const withBillingInfoQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withBillingInfoQuery",
	]),
	errors: {} as {
		query: billingInfoFn.Error;
	},
	keys() {
		return [
			"billing",
			"info",
		];
	},
	async queryFn(): Promise<BillingInfoSchema.Type> {
		return billingInfoFn();
	},
});
