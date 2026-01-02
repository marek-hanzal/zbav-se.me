import { z } from "@hono/zod-openapi";
import { list, rangedom } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { listingCollectionFx } from "~/@user/listing/fx/listingCollectionFx";
import { listingCountFx } from "~/@user/listing/fx/listingCountFx";
import type { ListingSortSchema } from "~/app/listing/schema/ListingSortSchema";

export const ListingOfRequestSchema = z.object({
	count: z.number().openapi({
		description: "Count of listings to create",
	}),
});

type ListingOfRequestSchema = typeof ListingOfRequestSchema;

namespace ListingOfRequestSchema {
	export type Type = z.infer<ListingOfRequestSchema>;
}

export const listingOfFx = ({ count }: ListingOfRequestSchema.Type) => {
	return Effect.gen(function* () {
		const total = yield* listingCountFx({
			where: {
				withOwn: false,
			},
		});

		return yield* listingCollectionFx({
			cursor: {
				page: rangedom(0, Math.max(0, Math.floor(total.total / count))),
				size: count,
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
};
