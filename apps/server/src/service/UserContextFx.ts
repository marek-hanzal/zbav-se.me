import { Context, Effect } from "effect";
import type { auth } from "../auth/auth";

export class UserContextFx extends Context.Tag("UserContextFx")<
	UserContextFx,
	typeof auth.$Infer.Session.user
>() {
	//
}

export const UserContextProvider = (user: typeof auth.$Infer.Session.user) =>
	Effect.provideService(UserContextFx, user);
