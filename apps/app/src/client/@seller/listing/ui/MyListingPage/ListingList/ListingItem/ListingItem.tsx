import { Typo } from "@use-pico/client/ui/typo";
import { withFallback } from "@use-pico/client/utils";
import { useUpload } from "~/client/@common/gallery/hook/useUpload";
import { ListItem } from "~/client/@common/list-item/ListItem";
import { ListItemPending } from "~/client/@common/list-item/ListItemPending";
import { withListingQuery } from "~/client/@seller/listing/query/withListingQuery";

export namespace ListingItem {
	export interface Props {
		listingId: string;
	}
}

/**
 * Wraps one seller listing row in suspense so item-level data can resolve with isolated fallback.
 * Use it inside virtualized or incremental listing collections where each item may load independently.
 *
 * @see apps/app/src/app//listing/MyListingPage/ListingList/ListingList.tsx
 */
export const ListingItem = withFallback(({ listingId }: ListingItem.Props) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const hero = useUpload(listing.gallery.items);

	return (
		<ListItem
			hero={hero}
			title={
				<Typo
					label={listing.title ?? "Draft (label)"}
					ui={{
						tone: "neutral",
						theme: "light",
						color: "lead",
						font: "semibold",
						text: "sm",
						display: "block",
						width: "full",
						truncate: true,
					}}
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
