import type { z } from "zod";
import { ActivityTableSchema } from "~/database/schema/ActivityTable";

export const ActivitySchema = ActivityTableSchema.meta({
	id: "Activity",
	description: "Activity item",
});

export type ActivitySchema = typeof ActivitySchema;

export namespace ActivitySchema {
	export type Type = z.infer<ActivitySchema>;
}
