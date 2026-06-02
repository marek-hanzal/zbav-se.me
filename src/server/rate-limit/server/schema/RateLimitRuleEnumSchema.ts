import { z } from "zod";

export const RateLimitRuleEnumSchema = z.enum([
	"auth:magic-link",
	"auth:magic-link-source",
	"auth:password-reset",
	"auth:password-reset-source",
	"billing:stripe-webhook",
	"email:request",
	"email:source",
	"listing:event",
	"s3:presign",
	"sign-up:request",
]);

export type RateLimitRuleEnumSchema = typeof RateLimitRuleEnumSchema;

export namespace RateLimitRuleEnumSchema {
	export type Type = z.infer<RateLimitRuleEnumSchema>;
}
