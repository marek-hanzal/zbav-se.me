import { z } from "zod";

export const UserResourceBundleTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the user resource bundle assignment",
		}),
		userId: z.string().meta({
			description: "ID of the user assigned to the resource bundle",
		}),
		resourceBundleId: z.string().meta({
			description: "ID of the assigned resource bundle",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
		availableAt: z.coerce.date().meta({
			description: "Timestamp when the resource bundle assignment becomes active",
			type: "string",
		}),
		expiresAt: z.coerce.date().nullable().meta({
			description: "Timestamp when the resource bundle assignment stops being active",
			type: "string",
		}),
	})
	.meta({
		id: "UserResourceBundleTable",
		description: "Database row for a user resource bundle assignment.",
	})
	.strip();

export type UserResourceBundleTableSchema = typeof UserResourceBundleTableSchema;

export namespace UserResourceBundleTableSchema {
	export type Type = z.infer<UserResourceBundleTableSchema>;
}
