import type { FC } from "react";
import { HeroImage } from "~/application-ui/ui/img.exports";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import type { ListingSchema } from "~/seller-listing/schema/ListingSchema";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { useView } from "~/view/hook/useView";

export namespace HeroSection {
	export interface Props {
		listing: ListingSchema.Type;
		view: useView.Use<"gallery">;
	}
}

export const HeroSection: FC<HeroSection.Props> = ({ listing, view }) => {
	const [hero] = listing.withImageUrl;

	useRenderLogger({
		logger: getRootLoggerFn(),
		name: "HeroSection",
		meta: {
			listingId: listing.id,
		},
	});

	return (
		<HeroImage
			data-ui={"HeroSection"}
			src={hero}
			alt={`Hero image for listing ${listing.id}`}
			data-action={"open listing gallery"}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				view.setFn("gallery");
			}}
			data-ui-round="default"
			className={"h-64"}
		/>
	);
};
