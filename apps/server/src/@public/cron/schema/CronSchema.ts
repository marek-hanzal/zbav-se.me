import { z } from "@hono/zod-openapi";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const CronSchema = z.object({
	status: NoticeSchema,
	timestamp: z.coerce.date().openapi({
		description: "Timestamp when the cron job was executed",
		type: "string",
	}),
});

export type CronSchema = typeof CronSchema;

export namespace CronSchema {
	export type Type = z.infer<CronSchema>;
}
