import { z } from "zod";

export const TitleSchema = z.string().min(5).max(72).meta({
	description: "Title of the item",
});

export type TitleSchema = typeof TitleSchema;

export namespace TitleSchema {
	export type Type = z.infer<TitleSchema>;
}
