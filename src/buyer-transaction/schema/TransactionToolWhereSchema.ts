import { z } from "zod";
import { TransactionWhereSchema } from "~/buyer-transaction/schema/TransactionWhereSchema";

export const TransactionToolWhereSchema = z
	.looseObject({
		...TransactionWhereSchema.shape,
	})
	.omit({
		idIn: true,
		statusIn: true,
		userId: true,
	})
	.strip();

export type TransactionToolWhereSchema = typeof TransactionToolWhereSchema;

export namespace TransactionToolWhereSchema {
	export type Type = z.infer<TransactionToolWhereSchema>;
}
