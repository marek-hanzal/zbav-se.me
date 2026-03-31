import { z } from "zod";
import { TransactionEntryKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntryKindEnumSchema";
import { EntrySchema } from "./EntrySchema";

export const CommonSchema = z
	.looseObject({
		...EntrySchema.shape,
		/**
		 * Take off specific schemas already handled, rest shares the same
		 * structure, so we can make the stuff much simpler here.
		 */
		kind: TransactionEntryKindEnumSchema.exclude([
			"text",
			"gallery",
			"location",
			"package",
			"personal",
		]).meta({
			id: "TransactionCommonKindEnum",
			description: "Common (shared) entries sharing same shape",
		}),
		payload: z
			.looseObject({
				text: z.string().meta({
					description: "Translation key for the system/status timeline entry",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "TransactionEntryCommon",
		description: "Common entry payload",
	});

export type CommonSchema = typeof CommonSchema;

export namespace CommonSchema {
	export type Type = z.infer<CommonSchema>;
}
