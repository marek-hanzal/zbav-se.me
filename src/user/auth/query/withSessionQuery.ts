import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { getSessionFn } from "../fn/getSessionFn";

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
		staleTime: 5 * 60 * 1_000,
		gcTime: 5 * 60 * 1_000,
	},
});
