import { genIdFn } from "~/identity/fn/genIdFn";

export function createUserFn() {
	return {
		email: `${genIdFn()}@x32.cz`,
		password: "12345678",
	} as const;
}
