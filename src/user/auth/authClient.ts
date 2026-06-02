import { anonymousClient, customSessionClient, magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "~/server/auth/auth";

export const authClient = createAuthClient({
	plugins: [
		anonymousClient(),
		customSessionClient<auth>(),
		magicLinkClient(),
	],
});
