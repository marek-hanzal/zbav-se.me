import { passkey } from "@better-auth/passkey";
import { genId } from "@use-pico/common/gen-id";
import { betterAuth } from "better-auth";
import { anonymous, customSession, openAPI } from "better-auth/plugins";
import { type Dialect, Kysely } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { AppEnv } from "~/AppEnv";
import type { Database } from "~/database/Database";

export namespace auth {
	export type Api = Awaited<ReturnType<typeof auth>>;

	export type User = Api["$Infer"]["Session"]["user"];
	export type Session = Api["$Infer"]["Session"]["session"];
}

export const auth = async (dialect: () => Promise<Dialect>) => {
	const connection = await dialect();

	/**
	 * Necessary - resolves circular dependency
	 */
	const authKysely = new Kysely<Database>({
		dialect: connection,
		log: [
			"error",
		],
	});

	return betterAuth({
		database: connection,
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
};
