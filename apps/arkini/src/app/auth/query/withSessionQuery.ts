import { withQuery } from "@use-pico/client/query";
import { getSessionFn } from "~/app/auth/getSessionFn";

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
});
