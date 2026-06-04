import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { checkoutFn } from "../fn/checkoutFn";
import type { BillingCheckoutCreateSchema } from "../server/schema/BillingCheckoutCreateSchema";
import type { BillingCheckoutSchema } from "../server/schema/BillingCheckoutSchema";

export const withBillingCheckoutCreateMutation = withMutation<
	BillingCheckoutCreateSchema.Type,
	BillingCheckoutSchema.Type,
	checkoutFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withBillingCheckoutCreateMutation",
	]),
	keys(variables) {
		return [
			"billing",
			"checkout",
			variables,
		];
	},
	async mutationFn(data) {
		return checkoutFn({
			data,
		});
	},
});
