import { z } from "zod";
import { EntrySchema } from "./EntrySchema";

export const PersonalSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: z.literal("personal"),
		payload: z
			.looseObject({
				name: z.string().meta({
					description: "Contact name",
				}),
				phone: z.string().meta({
					description: "Contact phone",
				}),
				email: z.email().meta({
					description: "Contact email",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "TransactionEntryPersonalCreate",
	});

export type PersonalSchema = typeof PersonalSchema;

export namespace PersonalSchema {
	export type Type = z.infer<PersonalSchema>;
}
