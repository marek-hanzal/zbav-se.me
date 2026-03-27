import { z } from "zod";

export const NoticeTypeEnumSchema = z
	.enum([
		"info",
		"warning",
		"error",
	])
	.meta({
		id: "NoticeTypeEnum",
		description: "Type of notice",
	});

export type NoticeTypeEnumSchema = typeof NoticeTypeEnumSchema;

export namespace NoticeTypeEnumSchema {
	export type Type = z.infer<NoticeTypeEnumSchema>;
}
