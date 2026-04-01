import { withQuery } from "@/lib/client/query";
import { getSessionFn } from "~/common/auth/getSessionFn";

export const withSessionQuery = withQuery<void, Awaited<ReturnType<typeof getSessionFn>>>({
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
