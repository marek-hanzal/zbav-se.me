import { z } from "zod";

export const ServerCronSchema = z
	.looseObject({
		SERVER_CRON_TOKEN: z.string().min(1, "Missing cron token"),
	})
	.strip();

export type ServerCronSchema = typeof ServerCronSchema;

export namespace ServerCronSchema {
	export type Type = z.infer<ServerCronSchema>;
}
