import { z } from "zod";
import { OrderEnumSchema } from "~/query/schema/OrderEnumSchema";

export const ActivitySortSchema = z
	.looseObject({
		field: z
			.enum([
				"timestamp",
				"archivedAt",
				"priority",
			])
			.meta({
				id: "ActivitySortField",
				description: "Sort field for activity collection",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "ActivitySort",
		description: "Sort object for activity collection",
	});

export type ActivitySortSchema = typeof ActivitySortSchema;

export namespace ActivitySortSchema {
	export type Type = z.infer<ActivitySortSchema>;
}
