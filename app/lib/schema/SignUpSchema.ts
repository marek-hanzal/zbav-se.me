import { z } from "zod";

export const SignUpSchema = z.object({
	name: z.string().min(2).max(64),
	email: z.string().email(),
	password: z.string().min(6).max(64),
});
export type SignUpSchema = typeof SignUpSchema;
export namespace SignUpSchema {
	export type Type = z.infer<SignUpSchema>;
}
