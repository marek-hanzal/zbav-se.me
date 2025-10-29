import { apiFeedCreateBody } from "@zbav-se.me/sdk";
import z from "zod";

export const FeedWizardSchema = z.object({
	...apiFeedCreateBody.partial().shape,
});

export type FeedWizardSchema = typeof FeedWizardSchema;

export namespace FeedWizardSchema {
	export type Type = z.infer<FeedWizardSchema>;
}
