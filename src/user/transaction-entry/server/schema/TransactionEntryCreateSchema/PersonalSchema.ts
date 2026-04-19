import { z } from "zod";
import { EntrySchema } from "./EntrySchema";

export const PersonalSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: z.literal("personal"),
		payload: z
			.looseObject({
				name: z.string().optional().meta({
					description: "Contact name",
				}),
				phone: z.string().optional().meta({
					description: "Contact phone",
				}),
				email: z.email().optional().meta({
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
