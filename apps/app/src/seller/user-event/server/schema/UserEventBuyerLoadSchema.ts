import { z } from "zod";
import { LoadEnumSchema } from "~/user/user-event/server/schema/LoadEnumSchema";

export const UserEventBuyerLoadSchema = z
	.looseObject({
		bucket: LoadEnumSchema.meta({
			description: "Load type of the buyer",
			example: "low",
		}),
	})
	.strip()
	.meta({
		id: "UserEventBuyerLoad",
		description:
			"Masks number of transactions of the buyer, basically it tells, how busy buyer is.",
	});

export type UserEventBuyerLoadSchema = typeof UserEventBuyerLoadSchema;

export namespace UserEventBuyerLoadSchema {
	export type Type = z.infer<UserEventBuyerLoadSchema>;
}
