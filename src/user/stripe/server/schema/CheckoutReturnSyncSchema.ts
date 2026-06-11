import { z } from "zod";

export const CheckoutReturnSyncSchema = z
	.looseObject({
		sessionId: z.string().min(1).optional(),
	})
	.strip();

export type CheckoutReturnSyncSchema = typeof CheckoutReturnSyncSchema;

export namespace CheckoutReturnSyncSchema {
	export type Type = z.infer<CheckoutReturnSyncSchema>;
}
