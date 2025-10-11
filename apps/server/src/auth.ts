import { genId } from "@use-pico/common";
import { betterAuth } from "better-auth";
import { dialect } from "./database/dialect";

export const auth = betterAuth({
	database: dialect,
	trustedOrigins: [
		__ORIGIN__,
	],
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		database: {
			generateId: () => genId(),
		},
	},
});
