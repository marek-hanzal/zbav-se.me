import type { FC } from "react";
import { HeroImage } from "~/application-ui/ui/img.exports";
import type { ListingSchema } from "~/buyer-listing/schema/ListingSchema";
import { TransactionButton } from "~/buyer-listing/ui/ListingCard/TransactionButton";
import { getUploadFn } from "~/gallery/fn/getUploadFn";
import type { ListingPriceSchema } from "~/listing/schema/ListingPriceSchema";
import { ListingPrice } from "~/listing/ui/ListingPrice";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { useTranslator } from "~/translation/hook/useTranslator";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { LabelValue } from "~/ui/ui/LabelValue";
import type { useView } from "~/view/hook/useView";

export namespace HeroSection {
	export interface Props extends MarkSuspense.Props {
		listing: ListingSchema.Type;
		view: useView.Use<"gallery">;
	}
}

export const HeroSection: FC<HeroSection.Props> = ({ listing, view }) => {
	const translator = useTranslator();
	const hero = getUploadFn(listing.withImageUrl);

	useRenderLogger({
		logger: getRootLoggerFn(),
		name: "HeroSection",
		meta: {
			listingId: listing.id,
		},
	});

	return (
		<>
			<Container
				data-ui={"HeroSection[Container]"}
				data-ui-position="relative"
				data-ui-flow={"vertical"}
				data-ui-gap={"default"}
			>
				<HeroImage
					src={hero}
					alt={`Hero image for listing ${listing.id}`}
					data-action={"open listing gallery"}
					onClick={() => view.setFn("gallery")}
					data-ui-round="default"
					className={"h-64"}
				/>

				<Container>
					<Group>
						<LabelValue
							textLabel={translator.textFn("Listing price (label)")}
							textValue={<ListingPrice price={listing as ListingPriceSchema.Type} />}
						/>

						<LabelValue
							textLabel={translator.textFn("Listing location (label)")}
							textValue={listing.location.address}
							textValueProps={{
								"data-ui-truncate": false,
								"data-ui-wrap": "wrap",
							}}
						/>
					</Group>
				</Container>
			</Container>

			{listing.my ? null : <TransactionButton listing={listing} />}
		</>
	);
};
