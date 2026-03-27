import { OrderEnumSchema } from "@use-pico/common/schema";
import { z } from "zod";

export const InboxSortSchema = z
	.looseObject({
		field: z
			.enum([
				"timestamp",
				"archivedAt",
				"priority",
			])
			.meta({
				id: "InboxSortField",
				description: "Sort field for inbox collection",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "InboxSort",
		description: "Sort object for inbox collection",
	});

export type InboxSortSchema = typeof InboxSortSchema;

export namespace InboxSortSchema {
	export type Type = z.infer<InboxSortSchema>;
}
