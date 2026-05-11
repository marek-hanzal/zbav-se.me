import type { FC } from "react";
import { useRenderLogger } from "@/lib/client/log";
import type { useView } from "@/lib/client/view";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { HeroImage } from "~/common/ui/img";

export namespace HeroSection {
	export interface Props {
		listing: ListingSchema.Type;
		view: useView.Use<"gallery">;
	}
}

export const HeroSection: FC<HeroSection.Props> = ({ listing, view }) => {
	const [hero] = listing.withImageUrl;

	useRenderLogger({
		logger: getRootLogger(),
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
				view.set("gallery");
			}}
			data-ui-round="default"
			className={"h-64"}
		/>
	);
};
