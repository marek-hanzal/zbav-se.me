import { z } from "zod";
import { UserEventFilterSchema } from "./UserEventFilterSchema";

export const UserEventWhereSchema = z
	.looseObject({
		...UserEventFilterSchema.shape,
	})
	.omit({
		userId: true,
	})
	.strip()
	.meta({
		id: "UserEventWhere",
		description: "App-based filters",
	});

export type UserEventWhereSchema = typeof UserEventWhereSchema;

export namespace UserEventWhereSchema {
	export type Type = z.infer<UserEventWhereSchema>;
}
