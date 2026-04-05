import { z } from "zod";

export const OAuthSearchSchema = z
	.looseObject({
		response_type: z.literal("code"),
		client_id: z.string().min(1, "client_id is required"),
		redirect_uri: z.url("redirect_uri must be a valid URL"),
		state: z.string().min(1, "state is required"),
		scope: z.string().optional(),
		code_challenge: z.string().min(1).optional(),
		code_challenge_method: z
			.enum([
				"plain",
				"S256",
			])
			.optional(),
		response_mode: z
			.enum([
				"query",
				"fragment",
				"form_post",
			])
			.optional(),
		nonce: z.string().min(1).optional(),
		prompt: z
			.enum([
				"none",
				"login",
				"consent",
				"select_account",
			])
			.optional(),
		login_hint: z.string().min(1).optional(),
		display: z
			.enum([
				"page",
				"popup",
				"touch",
				"wap",
			])
			.optional(),
		ui_locales: z.string().min(1).optional(),
		max_age: z.coerce.number().int().nonnegative().optional(),
		claims: z.string().min(1).optional(),
	})
	.strip();

export type OAuthSearchSchema = typeof OAuthSearchSchema;

export namespace OAuthSearchSchema {
	export type Type = z.infer<OAuthSearchSchema>;
}
