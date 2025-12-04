import { Container } from "@use-pico/client/ui/container";
import type { tListing, tListingQuery } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { CartToggleButton } from "~/app/listing/ui/button/CartToggleButton";
import { ListingFlagButton } from "~/app/listing/ui/button/ListingFlagButton";
import { ListingIgnoreButton } from "~/app/listing/ui/button/ListingIgnoreButton";
import { TransactionButton } from "~/app/listing/ui/button/TransactionButton";
import { GalleryButton } from "~/app/photo/ui/button/GalleryButton";

export namespace ListingDetailMenu {
	export type Tools = "transaction" | "cart";

	export interface Props extends Container.Props {
		locale: string;
		feedId: string;
		listing: tListing;
		/**
		 * Query used to fetch listing collection:
		 *
		 * Serves the source for patching the listing on various actions, e.g. moving to cart, ignoring, etc.
		 */
		query: tListingQuery;
		parentSheetId: string | undefined;
	}
}

export const ListingDetailMenu: FC<ListingDetailMenu.Props> = ({
	locale,
	feedId,
	listing,
	query,
	parentSheetId,
	...props
}) => {
	return (
		<Container
			layout={"vertical-flex"}
			height={"content"}
			gap={"sm"}
			{...props}
		>
			<GalleryButton uploads={listing.gallery.items.map((item) => item.upload)} />

			<TransactionButton
				locale={locale}
				listing={listing}
				parentSheetId={parentSheetId}
			/>

			<CartToggleButton
				feedId={feedId}
				listing={listing}
			/>

			<ListingIgnoreButton
				listing={listing}
				query={query}
			/>

			<ListingFlagButton
				listing={listing}
				query={query}
			/>
		</Container>
	);
};
