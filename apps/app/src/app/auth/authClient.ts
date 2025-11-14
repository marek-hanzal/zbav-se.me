import type { auth } from "@zbav-se.me/server";
import { anonymousClient, customSessionClient, passkeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [
		passkeyClient(),
		anonymousClient(),
		customSessionClient<auth>(),
	],
	baseURL: import.meta.env.VITE_SERVER_API,
});
