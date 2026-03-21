import { passkey } from "@better-auth/passkey";
import { genId } from "@use-pico/common/gen-id";
import { betterAuth } from "better-auth";
import { anonymous, customSession, mcp, openAPI } from "better-auth/plugins";
import { type Dialect, Kysely } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import type { Database } from "~/database/Database";
import { ServerBetterAuthSchema } from "~/schema/env/ServerBetterAuthSchema";
import { ServerViteSchema } from "~/schema/env/ServerViteSchema";

export namespace auth {
	export type Api = Awaited<ReturnType<typeof auth>>;

	export type User = Api["$Infer"]["Session"]["user"];
	export type Session = Api["$Infer"]["Session"]["session"];

	export interface Config {
		basePath?: string;
	}
}

export const auth = (dialect: () => Dialect, config: auth.Config = {}) => {
	const connection = dialect();

	const betterAuthConfig = ServerBetterAuthSchema.parse(process.env);
	const viteConfig = ServerViteSchema.parse(process.env);
	const { hostname: originHost } = new URL(viteConfig.VITE_ORIGIN);

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
		baseURL: viteConfig.VITE_SERVER_API,
		basePath: config.basePath ?? "/api/auth",
		secret: betterAuthConfig.SERVER_BETTER_AUTH_SECRET,
		plugins: [
			passkey({
				rpID: originHost,
				rpName: originHost,
			}),
			anonymous({
				emailDomainName: originHost,
				generateName: () => genId(),
				async onLinkAccount() {
					//
				},
			}),
			mcp({
				loginPage: `${viteConfig.VITE_ORIGIN}/redirect/oath`,
				resource: new URL("/api/mcp", viteConfig.VITE_SERVER_API).toString(),
				oidcConfig: {
					loginPage: `${viteConfig.VITE_ORIGIN}/redirect/oath`,
					metadata: {
						issuer: viteConfig.VITE_SERVER_API,
					},
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
			viteConfig.VITE_ORIGIN,
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
				domain: originHost,
			},
			database: {
				generateId: () => genId(),
			},
		},
	});
};
