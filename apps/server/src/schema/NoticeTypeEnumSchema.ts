import { z } from "@hono/zod-openapi";

export const NoticeTypeEnumSchema = z
	.enum([
		"info",
		"warning",
		"error",
	])
	.openapi("NoticeTypeEnum", {
		description: "Type of notice",
	});

export type NoticeTypeEnumSchema = typeof NoticeTypeEnumSchema;

export namespace NoticeTypeEnumSchema {
	export type Type = z.infer<NoticeTypeEnumSchema>;
}
