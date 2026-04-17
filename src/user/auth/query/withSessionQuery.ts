import { getRootLogger } from "@/lib/client/log";
import { withQuery } from "@/lib/client/query";
import { getSessionFn } from "../fn/getSessionFn";

const logger = getRootLogger([
	"query",
	"withSessionQuery",
]);

export const withSessionQuery = withQuery<void, Awaited<ReturnType<typeof getSessionFn>>>({
	keys() {
		return [
			"session",
			"server",
		];
	},
	async queryFn() {
		logger.trace("queryFn");

		return getSessionFn();
	},
	defaultOptions: {
		staleTime: 5 * 60 * 1_000,
		gcTime: 5 * 60 * 1_000,
	},
});
