import { z } from "zod";

export const CountEnumSchema = z.enum([
	"total",
	"filter",
	"where",
]);

export type CountEnumSchema = typeof CountEnumSchema;

export namespace CountEnumSchema {
	export type Type = z.infer<CountEnumSchema>;
}
