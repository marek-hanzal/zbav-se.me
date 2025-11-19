import { Context, Effect } from "effect";
import type { auth } from "../auth";

export type UserContext = typeof auth.$Infer.Session.user;

export class UserContextFx extends Context.Tag("UserContextFx")<UserContextFx, UserContext>() {
	//
}

export const UserContextProvider = (user: UserContext) => {
	return Effect.provideService(UserContextFx, user);
};
