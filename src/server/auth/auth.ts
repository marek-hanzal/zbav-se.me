import { betterAuth } from "better-auth";
import {
	APIError,
	createAuthMiddleware,
	requestPasswordReset,
	sendVerificationEmail,
	signUpEmail,
} from "better-auth/api";
import { anonymous, customSession, magicLink } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Effect } from "effect";
import { type Dialect, Kysely } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { createElement } from "react";
import { match, P } from "ts-pattern";
import { TranslationContext } from "@/lib/client/translation";
import type { withDatabaseFx } from "@/lib/common/database";
import { genId } from "@/lib/common/gen-id";
import { withLoggerFx } from "@/lib/common/log";
import type { translator } from "@/lib/common/translation/translator";
import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { EmailVerificationEmail } from "~/email/template/EmailVerificationEmail";
import { MagicLinkEmail } from "~/email/template/MagicLinkEmail";
import { PasswordResetEmail } from "~/email/template/PasswordResetEmail";
import type { Database } from "~/server/database/Database";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { toMailKeyId } from "~/server/email/fn/toMailKeyId";
import { mailtoFx } from "~/server/email/fx/mailtoFx";
import { withMailContextFx } from "~/server/email/fx/withMailContextFx";
import { ServerBetterAuthSchema } from "~/server/env/ServerBetterAuthSchema";
import { ServerE2eSchema } from "~/server/env/ServerE2eSchema";
import { ServerMailSchema } from "~/server/env/ServerMailSchema";
import { RateLimitErrorFx } from "~/server/error/RateLimitErrorFx";
import { toRequestSource } from "~/server/middleware/toRequestSource";
import { rateLimitCheckFx } from "~/server/rate-limit/server/fx/rateLimitCheckFx";
import { userResourceBundleCreateFx } from "~/user/resource-bundle/server/fx/userResourceBundleCreateFx";

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
		translator: translator.Translator;
	}
}

export type auth = ReturnType<typeof auth>;

export const auth = ({ dialect, config = {}, translator }: auth.Props) => {
	const connection = dialect();

	const betterAuthConfig = ServerBetterAuthSchema.parse(process.env);
	const e2eConfig = ServerE2eSchema.parse(process.env);
	const viteConfig = ViteEnvSchema.parse(process.env);
	const { hostname: originHost } = new URL(viteConfig.VITE_ORIGIN);
	const getMailConfig = () => ServerMailSchema.parse(process.env);

	/**
	 * Necessary - resolves circular dependency
	 */
	const kysely = new Kysely<Database>({
		dialect: connection,
		log: [
			"error",
		],
	});
	const database = {
		dialect: connection,
		kysely,
		async migrate() {
			return undefined;
		},
	} satisfies withDatabaseFx.Instance<Database>;

	return betterAuth({
		database: connection,
		baseURL: viteConfig.VITE_ORIGIN,
		basePath: config.basePath ?? "/api/auth",
		secret: betterAuthConfig.SERVER_BETTER_AUTH_SECRET,
		logger: {
			level: "debug",
			disabled: false,
			log(level, message, ...args) {
				return match(level)
					.with("info", () => {
						return logger.info(message, ...args);
					})
					.with("error", () => {
						return logger.error(message, ...args);
					})
					.with("warn", () => {
						return logger.warn(message, ...args);
					})
					.with("debug", () => {
						return logger.trace(message, ...args);
					})
					.exhaustive();
			},
		},
		hooks: {
			before: createAuthMiddleware(async (ctx) => {
				const requestSource = toRequestSource(ctx.headers ?? new Headers());
				const checks = match({
					body: ctx.body,
					path: ctx.path,
				})
					.with(
						{
							path: signUpEmail().path,
						},
						(): rateLimitCheckFx.Props[] => [
							{
								key: [
									requestSource,
								],
								rule: "sign-up:request",
								message: "Too many requests from the single IP, sorry",
							},
						],
					)
					.with(
						{
							body: {
								email: P.string,
							},
							path: sendVerificationEmail.path,
						},
						({ body: { email } }): rateLimitCheckFx.Props[] => [
							{
								key: [
									email.toLowerCase(),
								],
								rule: "email:request",
								message:
									"Too many verification email requests. Please try again later.",
							},
							{
								key: [
									requestSource,
								],
								rule: "email:source",
								message:
									"Too many verification email requests. Please try again later.",
							},
						],
					)
					.with(
						{
							body: {
								email: P.string,
							},
							path: "/sign-in/magic-link",
						},
						({ body: { email } }): rateLimitCheckFx.Props[] => [
							{
								key: [
									email.toLowerCase(),
								],
								rule: "auth:magic-link",
								message: "Too many magic link requests. Please try again later.",
							},
							{
								key: [
									requestSource,
								],
								rule: "auth:magic-link-source",
								message: "Too many magic link requests. Please try again later.",
							},
						],
					)
					.with(
						{
							body: {
								email: P.string,
							},
							path: requestPasswordReset.path,
						},
						({ body: { email } }): rateLimitCheckFx.Props[] => [
							{
								key: [
									email.toLowerCase(),
								],
								rule: "auth:password-reset",
								message:
									"Too many password reset requests. Please try again later.",
							},
							{
								key: [
									requestSource,
								],
								rule: "auth:password-reset-source",
								message:
									"Too many password reset requests. Please try again later.",
							},
						],
					)
					.otherwise((): rateLimitCheckFx.Props[] => []);

				const rateLimitError = await Effect.forEach(checks, rateLimitCheckFx).pipe(
					withKyselyFx(database),
					withDateFx,
					withLoggerFx(logger),
					Effect.as(undefined),
					Effect.catchTag("RateLimitErrorFx", (error) => Effect.succeed(error)),
					Effect.runPromise,
				);

				if (rateLimitError instanceof RateLimitErrorFx) {
					throw new APIError("TOO_MANY_REQUESTS", {
						message: rateLimitError.message,
					});
				}
			}),
		},
		databaseHooks: {
			user: {
				create: {
					async after(user) {
						if (user.isAnonymous) {
							return;
						}

						await userResourceBundleCreateFx({
							userId: user.id,
							bundle: "free",
						}).pipe(
							withKyselyFx(database),
							withDateFx,
							withLoggerFx(logger),
							Effect.runPromise,
						);
					},
				},
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
			magicLink({
				disableSignUp: true,
				async sendMagicLink({ email, url, token }) {
					const mailConfig = getMailConfig();

					await mailtoFx({
						to: [
							email,
						],
						title: translator.text("Magic link email subject"),
						keyId: toMailKeyId("magic-link", {
							email,
							token,
						}),
						content: createElement(
							TranslationContext,
							{
								value: translator.list(),
							},
							createElement(MagicLinkEmail, {
								signInUrl: url,
							}),
						),
					}).pipe(
						withMailContextFx({
							host: mailConfig.SERVER_SMTP_HOST,
							port: mailConfig.SERVER_SMTP_PORT,
							username: mailConfig.SERVER_SMTP_USERNAME,
							password: mailConfig.SERVER_SMTP_PASSWORD,
							from: mailConfig.SERVER_SMTP_FROM,
						}),
						withLoggerFx(logger),
						Effect.runPromise,
					);
				},
			}),
			tanstackStartCookies(),
		],
		trustedOrigins: [
			viteConfig.VITE_ORIGIN,
		],
		rateLimit: {
			enabled: e2eConfig.SERVER_E2E !== "e2e",
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
			async sendResetPassword({ user, url, token }) {
				const mailConfig = getMailConfig();
				const link = new URL(url.replace("-placeholder-", token));

				await mailtoFx({
					to: [
						user.email,
					],
					title: translator.text("Password reset email subject"),
					keyId: toMailKeyId("password-reset", {
						email: user.email,
						token,
					}),
					content: createElement(
						TranslationContext,
						{
							value: translator.list(),
						},
						createElement(PasswordResetEmail, {
							resetUrl: link.toString(),
						}),
					),
				}).pipe(
					withMailContextFx({
						host: mailConfig.SERVER_SMTP_HOST,
						port: mailConfig.SERVER_SMTP_PORT,
						username: mailConfig.SERVER_SMTP_USERNAME,
						password: mailConfig.SERVER_SMTP_PASSWORD,
						from: mailConfig.SERVER_SMTP_FROM,
					}),
					withLoggerFx(logger),
					Effect.runPromise,
				);
			},
		},
		emailVerification: {
			sendOnSignUp: true,
			async sendVerificationEmail({ user, url }) {
				const mailConfig = getMailConfig();
				await mailtoFx({
					to: [
						user.email,
					],
					title: translator.text("Email verification email subject"),
					keyId: toMailKeyId("email-verification", {
						email: user.email,
						url,
					}),
					content: createElement(
						TranslationContext,
						{
							value: translator.list(),
						},
						createElement(EmailVerificationEmail, {
							verifyUrl: url,
						}),
					),
				}).pipe(
					withMailContextFx({
						host: mailConfig.SERVER_SMTP_HOST,
						port: mailConfig.SERVER_SMTP_PORT,
						username: mailConfig.SERVER_SMTP_USERNAME,
						password: mailConfig.SERVER_SMTP_PASSWORD,
						from: mailConfig.SERVER_SMTP_FROM,
					}),
					withLoggerFx(logger),
					Effect.runPromise,
				);
			},
		},
		advanced: {
			database: {
				generateId: () => genId(),
			},
		},
	});
};
