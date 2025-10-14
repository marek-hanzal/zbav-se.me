import { genId } from "@use-pico/common";
import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { dialect } from "./database/dialect";
import { AppEnv } from "./env";

const origin = new URL(AppEnv.ORIGIN).hostname;

export const auth = betterAuth({
	database: dialect,
	secret: AppEnv.BETTER_AUTH_SECRET,
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
		AppEnv.ORIGIN,
	],
	rateLimit: {
		window: 10,
		max: 100,
	},
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
			domain: origin,
		},
		database: {
			generateId: () => genId(),
		},
	},
});
