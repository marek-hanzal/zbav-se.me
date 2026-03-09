import { z } from "@hono/zod-openapi";
import { BaseEntrySchema } from "./BaseEntrySchema";

export const TransactionEntryPackageSchema = z
	.looseObject({
		...BaseEntrySchema.shape,
		kind: z.literal("package"),
		payload: z.looseObject({
			link: z.url().openapi({
				description: "Package tracking link",
			}),
			number: z.string().nullable().openapi({
				description: "Package tracking number",
			}),
		}),
	})
	.openapi("TransactionEntryPackage");
