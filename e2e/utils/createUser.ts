import { genId } from "~/identity/fn/genId";

export function createUser() {
	return {
		email: `${genId()}@x32.cz`,
		password: "12345678",
	} as const;
}
