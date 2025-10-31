import { zFeedCreate } from "@zbav-se.me/sdk";
import z from "zod";

export const FeedWizardSchema = z.object({
	...zFeedCreate.partial().shape,
	locationId: z.string().optional(),
	id: z.string().optional(),
});

export type FeedWizardSchema = typeof FeedWizardSchema;

export namespace FeedWizardSchema {
	export type Type = z.infer<FeedWizardSchema>;
}
