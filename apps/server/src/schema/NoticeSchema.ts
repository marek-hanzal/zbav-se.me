import { z } from "@hono/zod-openapi";
import { NoticeTypeEnumSchema } from "~/schema/NoticeTypeEnumSchema";

export const NoticeSchema = z
	.object({
		message: z.string().openapi({
			description: "Message",
		}),
		type: NoticeTypeEnumSchema,
	})
	.openapi("Notice", {
		description: "Just a note sent from various reasons, usually when something is fucked up.",
	});

export type NoticeSchema = typeof NoticeSchema;

export namespace NoticeSchema {
	export type Type = z.infer<NoticeSchema>;
}
