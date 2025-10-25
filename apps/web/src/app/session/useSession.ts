import { withQuery } from "@use-pico/client";
import { authClient } from "~/app/auth/authClient";

export const useSession = withQuery({
	keys(data) {
		return [
			"session",
			data,
		];
	},
	queryFn: async () => {
		return authClient.getSession();
	},
});
