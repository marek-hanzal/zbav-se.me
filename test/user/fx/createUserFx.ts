import { Effect } from "effect";
import type { auth } from "~/server/auth/auth";

export namespace createUserFx {
	export interface Props {
		api: auth.Api["api"];
		email: string;
		name: string;
		password?: string;
	}
}

export const createUserFx = Effect.fn("createUserFx")(function* ({
	api,
	email,
	name,
	password = "12345678",
}: createUserFx.Props) {
	const { user } = yield* Effect.promise(() =>
		api.signUpEmail({
			body: {
				email,
				name,
				password,
			},
		}),
	);

	return user;
});
