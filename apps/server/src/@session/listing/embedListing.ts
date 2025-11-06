import {
	embedding,
	embedMinHash,
	embedNumber,
	embedNumberRange,
	embedString,
} from "@use-pico/common/embedding";
import { database } from "../../database/kysely";
import { hasher } from "../../hasher";
import type { ListingDbSchema } from "./schema/ListingDbSchema";

export const embedListing = async (
	listing: Pick<
		ListingDbSchema.Type,
		"categoryId" | "age" | "condition" | "price" | "title"
	>,
) => {
	const $hasher = await hasher();

	const category = await database.kysely
		.selectFrom("category")
		.select([
			"group",
			"category",
		])
		.where("id", "=", listing.categoryId)
		.executeTakeFirstOrThrow();

	return embedding({
		blocks: [
			{
				vector: embedString({
					value: `${category.group}-${category.category}`,
					dimensions: 64,
					weight: 1,
					hasher: $hasher,
				}),
				weight: 1,
			},
			{
				vector: embedString({
					value: category.group,
					dimensions: 48,
					weight: 1,
					hasher: $hasher,
				}),
				weight: 0.9,
			},
			{
				vector: embedString({
					value: category.category,
					dimensions: 48,
					weight: 1,
					hasher: $hasher,
				}),
				weight: 0.9,
			},
			{
				vector: embedNumberRange({
					dimensions: 8,
					min: 0,
					max: 6,
					value: listing.age,
					weight: 1,
				}),
				weight: 0.65,
			},
			{
				vector: embedNumberRange({
					dimensions: 8,
					min: 0,
					max: 6,
					value: listing.condition,
					weight: 1,
				}),
				weight: 0.65,
			},
			{
				vector: embedNumber({
					dimensions: 16,
					hasher: $hasher,
					order: "asc",
					value: listing.price,
					weight: 1,
				}),
				weight: 0.35,
			},
			{
				vector: embedMinHash({
					value: listing.title,
					dimensions: 64,
				}),
				weight: 0.2,
			},
		],
	});
};
