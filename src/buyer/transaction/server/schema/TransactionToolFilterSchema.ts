import { z } from "zod";
import { TransactionFilterSchema } from "./TransactionFilterSchema";

export const TransactionToolFilterSchema = z
	.looseObject({
		...TransactionFilterSchema.shape,
	})
	.omit({
		idIn: true,
		statusIn: true,
		userId: true,
	})
	.strip();

export type TransactionToolFilterSchema = typeof TransactionToolFilterSchema;

export namespace TransactionToolFilterSchema {
	export type Type = z.infer<TransactionToolFilterSchema>;
}
