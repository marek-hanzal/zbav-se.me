import { z } from "@hono/zod-openapi";

export const ProsConsSchema = z.array(z.string().max(72)).max(5).openapi("ProsCons", {
	description: "Array of pros or cons, max 5 items, each string max 72 characters",
});

export type ProsConsSchema = typeof ProsConsSchema;

export namespace ProsConsSchema {
	export type Type = z.infer<ProsConsSchema>;
}
