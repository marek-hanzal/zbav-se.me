import type { z } from "zod";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";
import { ListingStatusEnumSchema } from "../enum/ListingStatusEnumSchema";

export const DraftListingSchema = ListingTableSchema.safeExtend({
	status: ListingStatusEnumSchema.extract([
		"draft",
	]),
});

export type DraftListingSchema = typeof DraftListingSchema;

export namespace DraftListingSchema {
	export type Type = z.infer<DraftListingSchema>;
}
