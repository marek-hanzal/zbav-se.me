import { z } from "zod";

export const DescriptionSchema = z.string().max(2048).meta({
	description: "Description of the item",
});

export type DescriptionSchema = typeof DescriptionSchema;

export namespace DescriptionSchema {
	export type Type = z.infer<DescriptionSchema>;
}
