import { getRootLogger } from "~/log/fn/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";
import { getSessionFn } from "~/user-auth/fn/getSessionFn";

export const withSessionQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withSessionQuery",
	]),
	keys() {
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
