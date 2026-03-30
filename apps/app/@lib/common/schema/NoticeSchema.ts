import { z } from "zod";
import { NoticeTypeEnumSchema } from "./NoticeTypeEnumSchema";

export const NoticeSchema = z
	.looseObject({
		message: z.string().meta({
			description: "Message",
		}),
		type: NoticeTypeEnumSchema,
	})
	.strip()
	.meta({
		id: "Notice",
		description: "Just a note sent from various reasons, usually when something is fucked up.",
	});

export type NoticeSchema = typeof NoticeSchema;

export namespace NoticeSchema {
	export type Type = z.infer<NoticeSchema>;
}
