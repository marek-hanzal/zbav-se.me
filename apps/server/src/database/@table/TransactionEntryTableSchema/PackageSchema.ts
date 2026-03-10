import { z } from "@hono/zod-openapi";
import { EntrySchema } from "./EntrySchema";

export const PackageSchema = z
	.looseObject({
		...EntrySchema.shape,
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
	.strip()
	.openapi("TransactionEntryPackage");
