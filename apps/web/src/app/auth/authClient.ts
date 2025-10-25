import { anonymousClient, passkeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [
		passkeyClient(),
		anonymousClient(),
	],
	baseURL: import.meta.env.VITE_SERVER_API,
});
