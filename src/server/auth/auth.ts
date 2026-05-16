import { betterAuth } from "better-auth";
import { anonymous, customSession } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import type { translator as Translator } from "@/lib/common/translation/translator";
import { Effect } from "effect";
import { type Dialect, Kysely } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { createElement } from "react";
import { match } from "ts-pattern";
import { TranslationContext } from "@/lib/client/translation";
import { genId } from "@/lib/common/gen-id";
import { withLoggerFx } from "@/lib/common/log";
import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import type { Database } from "~/server/database/Database";
import { mailtoFx } from "~/server/email/fx/mailtoFx";
import { withMailContextFx } from "~/server/email/fx/withMailContextFx";
import { PasswordResetEmail } from "~/server/email/ui/PasswordResetEmail";
import { ServerBetterAuthSchema } from "~/server/env/ServerBetterAuthSchema";
import { ServerMailSchema } from "~/server/env/ServerMailSchema";

const logger = getRootLogger("auth");

export namespace auth {
	export type Api = Awaited<ReturnType<typeof auth>>;

	export type User = Api["$Infer"]["Session"]["user"];
	export type Session = Api["$Infer"]["Session"]["session"];

	export interface Config {
		basePath?: string;
	}

	export interface Props {
		/**
		 * Connection to database Dialect.
		 */
		dialect(): Dialect;
		/**
		 * Optional auth config
		 */
		config?: auth.Config;
		/**
		 * Prepared translator used for auth-side translations.
		 */
		translator: Translator.Translator;
	}
}

export type auth = ReturnType<typeof auth>;

export const auth = ({ dialect, config = {}, translator }: auth.Props) => {
	const connection = dialect();

	const betterAuthConfig = ServerBetterAuthSchema.parse(process.env);
	const mailConfig = ServerMailSchema.parse(process.env);
	const viteConfig = ViteEnvSchema.parse(process.env);
	const { hostname: originHost } = new URL(viteConfig.VITE_ORIGIN);

	/**
	 * Necessary - resolves circular dependency
	 */
	const kysely = new Kysely<Database>({
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
		logger: {
			level: "debug",
			disabled: false,
			log(level, message) {
				return match(level)
					.with("info", () => {
						return logger.info(message);
					})
					.with("error", () => {
						return logger.error(message);
					})
					.with("warn", () => {
						return logger.warn(message);
					})
					.with("debug", () => {
						return logger.trace(message);
					})
					.exhaustive();
			},
		},
		plugins: [
			anonymous({
				emailDomainName: originHost,
				generateName: () => genId(),
				async onLinkAccount() {
					//
				},
			}),
			customSession(async ({ user, session }) => {
				const userEx = await kysely
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
				} as const;
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
		session: {
			cookieCache: {
				enabled: false,
			},
		},
		emailAndPassword: {
			enabled: true,
			revokeSessionsOnPasswordReset: true,
			async sendResetPassword({ user, url }) {
				await mailtoFx({
					to: [
						user.email,
					],
					title: translator.text("Password reset email subject"),
					content: createElement(
						TranslationContext,
						{
							value: translator.list(),
						},
						createElement(PasswordResetEmail, {
							resetUrl: url,
						}),
					),
				}).pipe(
					withMailContextFx({
						key: mailConfig.SERVER_RESEND,
						from: mailConfig.SERVER_RESEND_FROM,
					}),
					withLoggerFx(logger),
					Effect.runPromise,
				);
			},
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
