// import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { anonymous, customSession, mcp, openAPI } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { type Dialect, Kysely } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { genId } from "@/lib/common/gen-id";
import type { Database } from "~/server/database/Database";
import { ServerBetterAuthSchema } from "~/server/env/ServerBetterAuthSchema";
import { ServerViteSchema } from "~/server/env/ServerViteSchema";

export namespace auth {
	export type Api = Awaited<ReturnType<typeof auth>>;

	export type User = Api["$Infer"]["Session"]["user"];
	export type Session = Api["$Infer"]["Session"]["session"];

	export interface Config {
		basePath?: string;
	}
}

export type auth = ReturnType<typeof auth>;

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
		baseURL: viteConfig.VITE_ORIGIN,
		basePath: config.basePath ?? "/api/auth",
		secret: betterAuthConfig.SERVER_BETTER_AUTH_SECRET,
		plugins: [
			// passkey({
			// 	rpID: originHost,
			// 	rpName: originHost,
			// }),
			anonymous({
				emailDomainName: originHost,
				generateName: () => genId(),
				async onLinkAccount() {
					//
				},
			}),
			mcp({
				loginPage: `${viteConfig.VITE_ORIGIN}/redirect/oath`,
				resource: new URL("/api/mcp", viteConfig.VITE_ORIGIN).toString(),
				oidcConfig: {
					loginPage: `${viteConfig.VITE_ORIGIN}/redirect/oath`,
					metadata: {
						issuer: viteConfig.VITE_ORIGIN,
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
			tanstackStartCookies(),
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
