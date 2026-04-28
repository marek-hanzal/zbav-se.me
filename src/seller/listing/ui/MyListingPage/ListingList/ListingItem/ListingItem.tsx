import { withFallback } from "@/lib/client/fallback";
import { Typo } from "@/lib/client/typo";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListItem } from "~/common/list-item/ListItem";
import { ListItemPending } from "~/common/list-item/ListItemPending";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";

export namespace ListingItem {
	export interface Props {
		listingId: string;
	}
}

/**
 * Wraps one seller listing row in suspense so item-level data can resolve with isolated fallback.
 * Use it inside virtualized or incremental listing collections where each item may load independently.
 */
export const ListingItem = withFallback(({ listingId }: ListingItem.Props) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const hero = useUpload(listing.withImageUrl);

	return (
		<ListItem
			data-id={listing.id}
			data-ui={"MyListingItem"}
			hero={hero}
			title={
				<Typo
					label={"Draft (label)"}
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
}, ListItemPending);
