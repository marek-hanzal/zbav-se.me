import { anonymousClient, customSessionClient, magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { authFn } from "~/authentication/fn/authFn";

export const authClient = createAuthClient({
	plugins: [
		anonymousClient(),
		customSessionClient<authFn>(),
		magicLinkClient(),
	],
});
