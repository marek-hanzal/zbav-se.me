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
import { ViteEnvSchema } from "~/application-env/schema/ViteEnvSchema";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import type { Database } from "~/database/type/Database";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { toMailKeyIdFn } from "~/email/fn/toMailKeyIdFn";
import { withMailContextFn } from "~/email/fn/withMailContextFn";
import { mailtoFx } from "~/email/fx/mailtoFx";
import { EmailVerificationEmail } from "~/email/ui/EmailVerificationEmail";
import { MagicLinkEmail } from "~/email/ui/MagicLinkEmail";
import { PasswordResetEmail } from "~/email/ui/PasswordResetEmail";
import { genIdFn } from "~/identity/fn/genIdFn";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { rateLimitCheckFx } from "~/rate-limit/fx/rateLimitCheckFx";
import { toRequestSourceFn } from "~/request-middleware/fn/toRequestSourceFn";
import { ServerBetterAuthSchema } from "~/server-env/schema/ServerBetterAuthSchema";
import { ServerE2eSchema } from "~/server-env/schema/ServerE2eSchema";
import { ServerMailSchema } from "~/server-env/schema/ServerMailSchema";
import { RateLimitErrorFx } from "~/server-error/error/RateLimitErrorFx";
import { TranslationContext } from "~/translation/context/TranslationContext";
import type { translatorFn } from "~/translation/fn/translatorFn";
import { resourceBundleEnsureFx } from "~/user-resource-bundle/fx/resourceBundleEnsureFx";
import { userResourceBundleCreateFx } from "~/user-resource-bundle/fx/userResourceBundleCreateFx";

const logger = getRootLoggerFn("auth");

export namespace authFn {
	export type Api = Awaited<ReturnType<typeof authFn>>;

	export type User = Api["$Infer"]["Session"]["user"];
	export type Session = Api["$Infer"]["Session"]["session"];

	export interface Config {
		basePath?: string;
	}

	export interface Props {
		/**
		 * Connection to database Dialect.
		 */
		dialectFn(): Dialect;
		/**
		 * Optional auth config
		 */
		config?: authFn.Config;
		/**
		 * Prepared translator used for auth-side translations.
		 */
		translator: translatorFn.Translator;
	}
}

export type authFn = ReturnType<typeof authFn>;

export const authFn = ({ dialectFn, config = {}, translator }: authFn.Props) => {
	const connection = dialectFn();

	const betterAuthConfig = ServerBetterAuthSchema.parse(process.env);
	const e2eConfig = ServerE2eSchema.parse(process.env);
	const viteConfig = ViteEnvSchema.parse(process.env);
	const { hostname: originHost } = new URL(viteConfig.VITE_ORIGIN);
	const getMailConfigFn = () => ServerMailSchema.parse(process.env);

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
		async migrateFn() {
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
				const requestSource = toRequestSourceFn(ctx.headers ?? new Headers());
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
					withKyselyFn(database),
					withDateServiceFn(),
					withLoggerFn(logger),
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

						await Effect.gen(function* () {
							yield* userResourceBundleCreateFx({
								userId: user.id,
								bundle: "package:free",
							});

							yield* resourceBundleEnsureFx({
								userId: user.id,
							});
						}).pipe(
							withKyselyFn(database),
							withDateServiceFn(),
							withLoggerFn(logger),
							Effect.runPromise,
						);
					},
				},
			},
		},
		plugins: [
			anonymous({
				emailDomainName: originHost,
				generateName: () => genIdFn(),
				async onLinkAccount() {
					//
				},
			}),
			customSession(async ({ user, session }) => {
				const userEx = await kysely
					.selectFrom("user_ex")
					.selectAll()
					.select((ebFn) => {
						return jsonObjectFrom(
							ebFn
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
					const mailConfig = getMailConfigFn();

					await mailtoFx({
						to: [
							email,
						],
						title: translator.textFn("Magic link email subject"),
						keyId: toMailKeyIdFn("magic-link", {
							email,
							token,
						}),
						content: createElement(
							TranslationContext,
							{
								value: translator.listFn(),
							},
							createElement(MagicLinkEmail, {
								signInUrl: url,
							}),
						),
					}).pipe(
						withMailContextFn({
							host: mailConfig.SERVER_SMTP_HOST,
							port: mailConfig.SERVER_SMTP_PORT,
							username: mailConfig.SERVER_SMTP_USERNAME,
							password: mailConfig.SERVER_SMTP_PASSWORD,
							from: mailConfig.SERVER_SMTP_FROM,
						}),
						withLoggerFn(logger),
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
				const mailConfig = getMailConfigFn();
				const link = new URL(url.replace("-placeholder-", token));

				await mailtoFx({
					to: [
						user.email,
					],
					title: translator.textFn("Password reset email subject"),
					keyId: toMailKeyIdFn("password-reset", {
						email: user.email,
						token,
					}),
					content: createElement(
						TranslationContext,
						{
							value: translator.listFn(),
						},
						createElement(PasswordResetEmail, {
							resetUrl: link.toString(),
						}),
					),
				}).pipe(
					withMailContextFn({
						host: mailConfig.SERVER_SMTP_HOST,
						port: mailConfig.SERVER_SMTP_PORT,
						username: mailConfig.SERVER_SMTP_USERNAME,
						password: mailConfig.SERVER_SMTP_PASSWORD,
						from: mailConfig.SERVER_SMTP_FROM,
					}),
					withLoggerFn(logger),
					Effect.runPromise,
				);
			},
		},
		emailVerification: {
			sendOnSignUp: true,
			async sendVerificationEmail({ user, url }) {
				const mailConfig = getMailConfigFn();
				await mailtoFx({
					to: [
						user.email,
					],
					title: translator.textFn("Email verification email subject"),
					keyId: toMailKeyIdFn("email-verification", {
						email: user.email,
						url,
					}),
					content: createElement(
						TranslationContext,
						{
							value: translator.listFn(),
						},
						createElement(EmailVerificationEmail, {
							verifyUrl: url,
						}),
					),
				}).pipe(
					withMailContextFn({
						host: mailConfig.SERVER_SMTP_HOST,
						port: mailConfig.SERVER_SMTP_PORT,
						username: mailConfig.SERVER_SMTP_USERNAME,
						password: mailConfig.SERVER_SMTP_PASSWORD,
						from: mailConfig.SERVER_SMTP_FROM,
					}),
					withLoggerFn(logger),
					Effect.runPromise,
				);
			},
		},
		advanced: {
			database: {
				generateId: () => genIdFn(),
			},
		},
	});
};
