import { genId } from "@use-pico/common";
import { betterAuth } from "better-auth";
import { passkey } from "better-auth/plugins/passkey";
import { dialect } from "./database/dialect";

export const auth = betterAuth({
	database: dialect,
	plugins: [
		passkey({
			rpID: new URL(__ORIGIN__).hostname,
			rpName: "zbav-se.me",
		}),
	],
	trustedOrigins: [
		__ORIGIN__,
	],
	rateLimit: {
		window: 10,
		max: 100,
	},
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		database: {
			generateId: () => genId(),
		},
	},
});
