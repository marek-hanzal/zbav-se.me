import { apiFeedCreateBody, LonLanSchema } from "@zbav-se.me/sdk";
import z from "zod";

export const FeedWizardSchema = z.object({
	...apiFeedCreateBody.partial().shape,
	location: LatLonSchema.optional(),
});

export type FeedWizardSchema = typeof FeedWizardSchema;

export namespace FeedWizardSchema {
	export type Type = z.infer<FeedWizardSchema>;
}
