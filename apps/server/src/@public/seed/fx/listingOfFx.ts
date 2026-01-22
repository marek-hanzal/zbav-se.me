import { z } from "@hono/zod-openapi";
import { list, rangedom } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { listingCollectionFx } from "~/@session/listing/fx/listingCollectionFx";
import type { ListingSortSchema } from "~/@session/listing/schema/ListingSortSchema";
import { listingCountFx } from "~/app/listing/fx/listingCountFx";

export const ListingOfRequestSchema = z.object({
	userId: z.string().openapi({
		description: "ID of the user to create listings for",
	}),
	count: z.number().openapi({
		description: "Count of listings to create",
	}),
});

type ListingOfRequestSchema = typeof ListingOfRequestSchema;

namespace ListingOfRequestSchema {
	export type Type = z.infer<ListingOfRequestSchema>;
}

export const listingOfFx = Effect.fn("listingOfFx")(function* ({
	userId,
	count,
}: ListingOfRequestSchema.Type) {
	const total = yield* listingCountFx({
		where: {
			withOwn: false,
		},
		userId,
		scope: {
			userId,
		},
	});

	return yield* listingCollectionFx({
		cursor: {
			page: rangedom(0, Math.max(0, Math.floor(total.total / count))),
			size: count,
		},
		userId,
		scope: {
			userId,
		},
		sort: list<ListingSortSchema.Type[]>([
			[
				{
					field: "age",
					direction: list([
						"asc",
						"desc",
					]),
				},
			],
			[
				{
					field: "price",
					direction: list([
						"asc",
						"desc",
					]),
				},
			],
			[
				{
					field: "createdAt",
					direction: list([
						"asc",
						"desc",
					]),
				},
			],
		]),
	});
});
