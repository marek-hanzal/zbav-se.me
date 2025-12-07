import type { tGalleryItem, tListingTransactionGallery } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { EventBadge } from "../../EventBadge";

export namespace GalleryEvent {
	export interface Props extends Omit<EventBadge.Props, "actor" | "timestamp" | "toolbar"> {
		listingTransactionGallery: tListingTransactionGallery;
	}
}

export const GalleryEvent: FC<GalleryEvent.Props> = ({ listingTransactionGallery, ...props }) => {
	const [hero] = listingTransactionGallery.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	return (
		<EventBadge
			data-ui={"GalleryEvent-root"}
			actor={listingTransactionGallery.side}
			timestamp={listingTransactionGallery.createdAt}
			{...props}
		>
			<div className="w-full h-64 max-h-64">
				<HeroImage
					data-ui={"GalleryEvent-image"}
					src={hero.upload.url}
					alt={`Hero image for transaction ${listingTransactionGallery.id}`}
					visible
					round={"default"}
				/>
			</div>
		</EventBadge>
	);
};
