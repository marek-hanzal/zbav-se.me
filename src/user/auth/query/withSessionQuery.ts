import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { getSessionFn } from "../fn/getSessionFn";

export const withSessionQuery = withQuery<void, Awaited<ReturnType<typeof getSessionFn>>>({
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
	async queryFn() {
		return getSessionFn();
	},
	defaultOptions: {
		staleTime: 5 * 60 * 1_000,
		gcTime: 5 * 60 * 1_000,
	},
});
