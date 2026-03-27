import { z } from "zod";
import { InboxQuerySchema } from "./InboxQuerySchema";

export const InboxCountQuerySchema = z
	.looseObject({
		...InboxQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "InboxCountQuery",
		description: "Query object for inbox count",
	});

export type InboxCountQuerySchema = typeof InboxCountQuerySchema;

export namespace InboxCountQuerySchema {
	export type Type = z.infer<InboxCountQuerySchema>;
}
