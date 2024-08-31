import { createCookieSessionStorage } from "@remix-run/node";
import { serverEnv } from "~/env/env.server";

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: "_session",
		sameSite: "lax",
		path: "/",
		httpOnly: true,
		secrets: [serverEnv().COOKIE_SECRET],
		secure: serverEnv().NODE_ENV === "production",
	},
});

export const { getSession, commitSession, destroySession } = sessionStorage;
