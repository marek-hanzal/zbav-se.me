import { z } from "zod";

export const RatingSchema = z.int().min(1).max(6);

export type RatingSchema = typeof RatingSchema;

export namespace RatingSchema {
	export type Type = z.infer<RatingSchema>;
}
