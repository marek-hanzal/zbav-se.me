import { passkey } from "@better-auth/passkey";
import { genId } from "@use-pico/common/gen-id";
import { betterAuth } from "better-auth";
import { anonymous, customSession, openAPI } from "better-auth/plugins";
import { type Dialect, Kysely } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import type { Database } from "~/database/Database";
import { ServerBetterAuthSchema } from "~/schema/env/ServerBetterAuthSchema";
import { ServerViteSchema } from "~/schema/env/ServerViteSchema";

export namespace auth {
	export type Api = Awaited<ReturnType<typeof auth>>;

	export type User = Api["$Infer"]["Session"]["user"];
	export type Session = Api["$Infer"]["Session"]["session"];
}

export const auth = (dialect: () => Dialect) => {
	const connection = dialect();

	const betterAuthConfig = ServerBetterAuthSchema.parse(process.env);
	const viteConfig = ServerViteSchema.parse(process.env);

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
		secret: betterAuthConfig.SERVER_BETTER_AUTH_SECRET,
		plugins: [
			passkey({
				rpID: viteConfig.VITE_DOMAIN,
				rpName: viteConfig.VITE_DOMAIN,
			}),
			anonymous({
				emailDomainName: viteConfig.VITE_DOMAIN,
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
			viteConfig.VITE_WEB_ORIGIN,
			viteConfig.VITE_APP_ORIGIN,
			...(viteConfig.VITE_ARKINI_ORIGIN ? [viteConfig.VITE_ARKINI_ORIGIN] : []),
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
				domain: viteConfig.VITE_DOMAIN,
			},
			database: {
				generateId: () => genId(),
			},
		},
	});
};
