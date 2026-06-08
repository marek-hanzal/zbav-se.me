import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const UserResourceBundleFeatureTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the user resource bundle feature row",
		}),
		userResourceBundleId: z.string().meta({
			description: "ID of the owning user resource bundle assignment",
		}),
		resourceDefinitionId: ResourceDefinitionEnumSchema.meta({
			description: "Referenced resource definition name",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
		availableAt: z.coerce.date().meta({
			description: "Timestamp when this feature becomes active",
			type: "string",
		}),
		expiresAt: z.coerce.date().nullable().meta({
			description:
				"Timestamp when this feature stops being active; null means it does not expire",
			type: "string",
		}),
	})
	.meta({
		id: "UserResourceBundleFeatureTable",
		description: "Snapshot row for a resource feature granted to a user.",
	})
	.strip();

export type UserResourceBundleFeatureTableSchema = typeof UserResourceBundleFeatureTableSchema;

export namespace UserResourceBundleFeatureTableSchema {
	export type Type = z.infer<UserResourceBundleFeatureTableSchema>;
}
