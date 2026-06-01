import { z } from "zod";
import { ResourceLimitQuerySchema } from "./ResourceLimitQuerySchema";

export const ResourceLimitCountQuerySchema = z
	.looseObject({
		...ResourceLimitQuerySchema.pick({
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "ResourceLimitCountQuery",
		description: "Query object for effective user resource limit count",
	});

export type ResourceLimitCountQuerySchema = typeof ResourceLimitCountQuerySchema;

export namespace ResourceLimitCountQuerySchema {
	export type Type = z.infer<ResourceLimitCountQuerySchema>;
}
