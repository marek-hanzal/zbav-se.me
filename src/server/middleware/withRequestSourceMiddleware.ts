import { createMiddleware } from "@tanstack/react-start";

function toRequestSource(request: Request) {
	const forwardedFor = request.headers.get("x-forwarded-for");

	if (forwardedFor) {
		const [first] = forwardedFor.split(",");

		if (first) {
			return first.trim();
		}
	}

	return "unknown";
}

export const withRequestSourceMiddleware = createMiddleware().server(async ({ request, next }) => {
	return next({
		context: {
			requestSource: toRequestSource(request),
		},
	});
});
