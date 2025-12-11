import type { tGalleryItem, tTransactionGallery } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { EventBadge } from "../../EventBadge";

export namespace GalleryEvent {
	export interface Props extends Omit<EventBadge.Props, "actor" | "timestamp" | "toolbar"> {
		transactionGallery: tTransactionGallery;
	}
}

export const GalleryEvent: FC<GalleryEvent.Props> = ({ transactionGallery, ...props }) => {
	const [hero] = transactionGallery.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	return (
		<EventBadge
			data-ui={"GalleryEvent-root"}
			actor={transactionGallery.side}
			timestamp={transactionGallery.createdAt}
			{...props}
		>
			<div className="w-full h-64 max-h-64">
				<HeroImage
					data-ui={"GalleryEvent-image"}
					src={hero.upload.url}
					alt={`Hero image for transaction ${transactionGallery.id}`}
					visible
					round={"default"}
				/>
			</div>
		</EventBadge>
	);
};
