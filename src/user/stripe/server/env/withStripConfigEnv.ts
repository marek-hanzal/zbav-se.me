import { ServerStripeSchema } from "~/server/env/ServerStripeSchema";
import type { StripeConfig } from "../context/StripeConfigFx";

export const withStripConfigEnv = (): StripeConfig => {
	const { SERVER_STRIPE_SECRET, SERVER_STRIPE_WEBHOOK_SECRET } = ServerStripeSchema.parse(
		process.env,
	);

	return {
		secret: SERVER_STRIPE_SECRET,
		webhook: SERVER_STRIPE_WEBHOOK_SECRET,
	};
};
