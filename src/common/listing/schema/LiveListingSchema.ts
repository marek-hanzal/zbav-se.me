import { z } from "zod";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";
import { PriceTypeEnumSchema } from "../../price-type/enum/PriceTypeEnumSchema";
import { ListingExpireEnumSchema } from "../enum/ListingExpireEnumSchema";
import { ListingStatusEnumSchema } from "../enum/ListingStatusEnumSchema";
import { TitleSchema } from "./TitleSchema";

export const LiveListingSchema = ListingTableSchema.safeExtend({
	status: ListingStatusEnumSchema.extract([
		"live",
	]),
	//
	categoryId: z.string().min(1),
	withImageUrl: z.tuple(
		[
			z.string().min(1),
		],
		z.string(),
	),
	withUploadIds: z
		.tuple(
			[
				z.string().min(1),
			],
			z.string(),
		)
		.meta({
			description:
				"Denormalized ordered upload IDs used for draft gallery management and consistency checks",
		}),
	//
	title: TitleSchema,
	//
	locationId: z.string().min(1),
	priceType: PriceTypeEnumSchema,
	//
	expires: ListingExpireEnumSchema,
	//
	visibleAt: z.coerce.date().meta({
		description: "When a listing goes live",
	}),
	expiresAt: z.coerce.date().meta({
		description: "When a listing dies",
	}),
}).omit({
	galleryId: true,
	userId: true,
	withLocation: true,
});

export type LiveListingSchema = typeof LiveListingSchema;

export namespace LiveListingSchema {
	export type Type = z.infer<LiveListingSchema>;
}
