import { Effect } from "effect";
import type { Stripe } from "stripe";
import { dbFx } from "~/server/database/fx/dbFx";

export namespace lineItemCollectionFx {
	export interface Props {
		lineItems: Stripe.LineItem[];
	}
}

export const lineItemCollectionFx = Effect.fn("lineItemCollectionFx")(function* ({
	lineItems,
}: lineItemCollectionFx.Props) {
	if (!lineItems.length) {
		return [];
	}

	const items = lineItems
		.filter((item) => {
			if (!item.metadata) {
				return false;
			}

			if (!item.metadata.bundle) {
				return false;
			}

			return true;
		})
		.map((item) => {
			// biome-ignore lint/style/noNonNullAssertion: We're already sure here
			return item.metadata!.bundle as string;
		});

	return dbFx((kysely) => {
		return kysely
			.selectFrom("resource_bundle as rb")
			.innerJoin("resource_bundle_item as rbi", "rbi.resourceBundleId", "rb.id")
			.select("rbi.id")
			.where("rb.name", "in", items)
			.executeTakeFirst();
	});
});

export type lineItemCollectionFx = ReturnType<typeof lineItemCollectionFx>;
