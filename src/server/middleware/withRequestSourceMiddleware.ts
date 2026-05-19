import { createMiddleware } from "@tanstack/react-start";
import { toRequestSource } from "./toRequestSource";

export const withRequestSourceMiddleware = createMiddleware().server(async ({ request, next }) => {
	return next({
		context: {
			requestSource: toRequestSource(request.headers),
		},
	});
});
