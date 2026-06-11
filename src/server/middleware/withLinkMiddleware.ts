import { createMiddleware } from "@tanstack/react-start";
import { linkTo } from "@/lib/common/link-to";
import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";

/**
 * This middleware provides a way how to generate absolute URLs, usefull for callbacks and this kind
 * of shit.
 */
export const withLinkMiddleware = createMiddleware().server(async ({ next }) => {
	const { VITE_ORIGIN } = ViteEnvSchema.parse(process.env);

	const link = (props: linkTo.Props) => {
		return linkTo({
			base: VITE_ORIGIN,
			...props,
		});
	};

	return next({
		context: {
			link,
		},
	});
});
