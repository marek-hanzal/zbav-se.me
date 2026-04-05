import { anonymousClient, customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import type { auth } from "~/server/auth/auth";

export const authClient = createAuthClient({
	plugins: [
		anonymousClient(),
		customSessionClient<auth.Api>(),
		tanstackStartCookies(),
	],
	baseURL: import.meta.env.VITE_ORIGIN,
});
