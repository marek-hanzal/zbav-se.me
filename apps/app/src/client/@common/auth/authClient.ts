import { passkeyClient } from "@better-auth/passkey/client";
import { anonymousClient, customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "~/server/auth/auth";

export const authClient = createAuthClient({
	plugins: [
		passkeyClient(),
		anonymousClient(),
		customSessionClient<auth.Api>(),
	],
	// baseURL: import.meta.env.VITE_SERVER_API,
});
