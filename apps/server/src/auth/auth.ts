import { genId } from "@use-pico/common";
import { betterAuth } from "better-auth";
import { anonymous, customSession, openAPI } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { Kysely } from "kysely";
import { AppEnv } from "../AppEnv";
import { dialect } from "../database/dialect";
import type { UserExSchema } from "../user-ex/schema/UserExSchema";

const authKysely = new Kysely<{
	user_ex: UserExSchema.Type;
}>({
	dialect,
	log: [
		"error",
	],
});

export const auth = betterAuth({
	database: dialect,
	secret: AppEnv.SERVER_BETTER_AUTH_SECRET,
	plugins: [
		passkey({
			rpID: AppEnv.VITE_DOMAIN,
			rpName: AppEnv.VITE_DOMAIN,
		}),
		anonymous({
			emailDomainName: AppEnv.VITE_DOMAIN,
			generateName: () => genId(),
			async onLinkAccount() {
				//
			},
		}),
		openAPI({
			disableDefaultReference: true,
		}),
		customSession(async ({ user, session }) => {
			const userEx = await authKysely
				.selectFrom("user_ex")
				.selectAll()
				.where("userId", "=", user.id)
				.executeTakeFirst();

			return {
				user: {
					...userEx,
					...user,
				},
				session,
			};
		}),
	],
	trustedOrigins: [
		AppEnv.VITE_WEB_ORIGIN,
		AppEnv.VITE_APP_ORIGIN,
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
			domain: AppEnv.VITE_DOMAIN,
		},
		database: {
			generateId: () => genId(),
		},
	},
});
