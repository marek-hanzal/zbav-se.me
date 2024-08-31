import { Authenticator } from "remix-auth";
import type { Token } from "~/auth/Token";
import { sessionStorage } from "~/session/session.server";

export const authenticator = new Authenticator<Token>(sessionStorage);

const getCallback = (name: string) => {
	return `http://localhost:3000/auth/${provider}/callback`;
};

// authenticator.use();
