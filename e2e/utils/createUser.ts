import { genId } from "@/lib/common/gen-id";

export function createUser() {
	return {
		email: `${genId()}@x32.cz`,
		password: "12345678",
	} as const;
}
