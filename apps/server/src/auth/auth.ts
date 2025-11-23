import { genId } from "@use-pico/common/gen-id";
import { betterAuth } from "better-auth";
import { passkey } from "better-auth/passkey";
import { anonymous, customSession, openAPI } from "better-auth/plugins";
import { Kysely } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { AppEnv } from "~/AppEnv";
import type { Database } from "~/database/Database";
import { dialect } from "~/database/dialect";

const authKysely = new Kysely<Database>({
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
				.select((eb) => {
					return jsonObjectFrom(
						eb
							.selectFrom("location")
							.selectAll("location")
							.whereRef("location.id", "=", "locationId")
							.limit(1),
					).as("location");
				})
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

export type auth = typeof auth;
