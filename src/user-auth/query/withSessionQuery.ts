import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import { getSessionFn } from "~/user-auth/fn/getSessionFn";

export const withSessionQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withSessionQuery",
	]),
	keysFn() {
		return [
			"session",
			"server",
		];
	},
	async queryFn(
		_data: "No input data here, bro!",
	): Promise<Awaited<ReturnType<typeof getSessionFn>>> {
		return getSessionFn();
	},
	defaultOptions: {
		staleTime: 0,
		gcTime: 5 * 60 * 1_000,
	},
});
