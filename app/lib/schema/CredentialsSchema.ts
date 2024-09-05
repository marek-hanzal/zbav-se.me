import { z } from "zod";

export const CredentialsSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6).max(64),
});
export type CredentialsSchema = typeof CredentialsSchema;
export namespace CredentialsSchema {
	export type Type = z.infer<CredentialsSchema>;
}
