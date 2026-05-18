import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { useRenderLogger } from "@/lib/client/log";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { LabelValue } from "@/lib/client/value";
import type { useView } from "@/lib/client/view";
import type { ListingPriceSchema } from "~/common/listing/schema/ListingPriceSchema";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { getRootLogger } from "~/common/log/getRootLogger";
import { HeroImage } from "~/common/ui/img";
import type { ListingSchema } from "~/public/listing/server/schema/ListingSchema";

export namespace HeroSection {
	export interface Props extends MarkSuspense.Props {
		listing: ListingSchema.Type;
		view: useView.Use<"gallery">;
	}
}

export const HeroSection: FC<HeroSection.Props> = ({ listing, view }) => {
	const translator = useTranslator();
	const [hero] = listing.withImageUrl;

	useRenderLogger({
		logger: getRootLogger(),
		name: "HeroSection",
		meta: {
			listingId: listing.id,
		},
	});

	return (
		<Container
			data-ui={"HeroSection"}
			data-ui-position="relative"
			data-ui-flow={"vertical"}
			data-ui-gap={"default"}
		>
			<HeroImage
				src={hero}
				alt={`Hero image for listing ${listing.id}`}
				data-action={"open listing gallery"}
				onClick={() => view.set("gallery")}
				data-ui-round="default"
				className={"h-64"}
			/>

			<Container>
				<Group>
					<LabelValue
						textLabel={translator.text("Listing price (label)")}
						textValue={<ListingPrice price={listing as ListingPriceSchema.Type} />}
					/>

					<LabelValue
						textLabel={translator.text("Listing location (label)")}
						textValue={listing.location.address}
						textValueProps={{
							"data-ui-truncate": false,
							"data-ui-wrap": "wrap",
						}}
					/>
				</Group>
			</Container>
		</Container>
	);
};
