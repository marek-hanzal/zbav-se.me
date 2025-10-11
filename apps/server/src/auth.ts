import { genId } from "@use-pico/common";
import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { dialect } from "./database/dialect";

const origin = new URL(__ORIGIN__).hostname;

export const auth = betterAuth({
	database: dialect,
	plugins: [
		passkey({
			rpID: origin,
			rpName: origin,
		}),
		anonymous({
			emailDomainName: origin,
			generateName: () => genId(),
			async onLinkAccount() {
				//
			},
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
