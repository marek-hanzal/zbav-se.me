import type { FC } from "react";
import { Typo } from "@/lib/client/typo";
import { ListItem } from "~/common/list-item/ListItem";
import type { ListingSchema } from "~/seller/listing/server/schema/ListingSchema";

export namespace ListingItem {
	export interface Props {
		listing: ListingSchema.Type;
	}
}

/**
 * Wraps one seller listing row in suspense so item-level data can resolve with isolated fallback.
 * Use it inside virtualized or incremental listing collections where each item may load independently.
 */
export const ListingItem: FC<ListingItem.Props> = ({ listing }) => {
	const [hero] = listing.withImageUrl;

	return (
		<ListItem
			data-id={listing.id}
			data-ui={"MyListingItem"}
			hero={hero}
			title={
				<Typo
					label={listing.title}
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-color="lead"
					data-ui-font="semibold"
					data-ui-text="sm"
					data-ui-display="block"
					data-ui-width="full"
					data-ui-truncate
					className={[
						"block",
						"w-full",
						"max-w-full",
						"min-w-0",
					]}
				/>
			}
			bottom={undefined}
		/>
	);
};
