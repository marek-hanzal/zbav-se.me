import type { z } from "zod";
import { ListingStatusEnumSchema } from "./ListingStatusEnumSchema";

export const ListingStatusSelectEnumSchema = ListingStatusEnumSchema.extract([
	"live",
	"sold",
	"expired",
	"closed",
]);

export type ListingStatusSelectEnumSchema = typeof ListingStatusSelectEnumSchema;

export namespace ListingStatusSelectEnumSchema {
	export type Type = z.infer<ListingStatusSelectEnumSchema>;
}
