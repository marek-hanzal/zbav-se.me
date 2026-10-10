import { createMiddleware } from "@tanstack/react-start";
import { ViteEnvSchema } from "~/application-env/schema/ViteEnvSchema";
import { linkToFn } from "~/url/fn/linkToFn";

/**
 * This middleware provides a way how to generate absolute URLs, usefull for callbacks and this kind
 * of shit.
 */
export const withLinkMiddleware = createMiddleware().server(async ({ next: nextFn }) => {
	const { VITE_ORIGIN } = ViteEnvSchema.parse(process.env);

	const linkFn = (props: linkToFn.Props) => {
		return linkToFn({
			base: VITE_ORIGIN,
			...props,
		});
	};

	return nextFn({
		context: {
			linkFn,
		},
	});
});
