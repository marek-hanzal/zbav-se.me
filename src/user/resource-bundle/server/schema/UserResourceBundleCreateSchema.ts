import { z } from "zod";

export const UserResourceBundleCreateSchema = z
	.looseObject({
		bundle: z.string().min(1).meta({
			description: "Unique name of the resource bundle assigned to the user",
		}),
		availableAt: z.coerce.date().optional().meta({
			description: "Timestamp when the resource bundle assignment becomes active",
			type: "string",
		}),
		expiresAt: z.coerce.date().nullable().optional().meta({
			description: "Timestamp when the resource bundle assignment stops being active",
			type: "string",
		}),
	})
	.strip()
	.meta({
		id: "UserResourceBundleCreate",
		description: "Data for assigning a resource bundle to a user",
	});

export type UserResourceBundleCreateSchema = typeof UserResourceBundleCreateSchema;

export namespace UserResourceBundleCreateSchema {
	export type Type = z.infer<UserResourceBundleCreateSchema>;
}
