import type { FC } from "react";
import { HeroImage } from "~/application-ui/ui/img.exports";
import { TypoIcon } from "~/application-ui/ui/typo.exports";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { FavouriteButton } from "~/buyer-feed/ui/FavouriteButton";
import { TransactionButton } from "~/buyer-feed/ui/TransactionButton";
import type { ListingSchema } from "~/buyer-listing/schema/ListingSchema";
import { useUpload } from "~/gallery/hook/useUpload";
import type { ListingPriceSchema } from "~/listing/schema/ListingPriceSchema";
import { ListingPrice } from "~/listing/ui/ListingPrice";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Badge } from "~/ui/ui/Badge";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { LabelValue } from "~/ui/ui/LabelValue";
import type { useView } from "~/view/hook/useView";

export namespace HeroSection {
	export interface Props extends MarkSuspense.Props {
		feedId: string;
		listing: ListingSchema.Type;
		view: useView.Use<"gallery">;
	}
}

export const HeroSection: FC<HeroSection.Props> = ({ feedId, listing, view }) => {
	const translator = useTranslator();
	const hero = useUpload(listing.withImageUrl);
	const { data: feed } = withFeedQuery.useFetchQuery(feedId);

	useRenderLogger({
		logger: getRootLogger(),
		name: "HeroSection",
		meta: {
			listingId: listing.id,
			feedId,
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
				{listing.my ? null : (
					<FavouriteButton
						_suspense={"I know"}
						feedId={feedId}
						listingId={listing.id}
						iconProps={{
							"data-ui-text": "xl",
						}}
						data-ui-tone="secondary"
						data-ui-theme="light"
						data-ui-round="full"
						data-ui-square="md"
						data-ui-justify="center"
						data-ui-items="center"
						data-ui-size={undefined}
						data-ui-inner={undefined}
						data-ui-snap-to="top-right"
						data-ui-z-index
						meta={feed.query.meta}
					/>
				)}

				<HeroImage
					src={hero}
					alt={`Hero image for listing ${listing.id}`}
					data-action={"open listing gallery"}
					onClick={() => view.set("gallery")}
					data-ui-round="default"
					className={"h-64"}
				/>

				{listing.isActive ? null : (
					<Badge
						data-ui-badge={undefined}
						data-ui-tone="warning"
						data-ui-inner="default"
					>
						<TypoIcon
							icon={"icon-[solar--alarm-outline]"}
							iconProps={{
								"data-ui-text": "2xl",
							}}
						>
							<Tx
								label={"Listing no longer active (label)"}
								data-ui-text="lg"
							/>
							<Tx
								label={"Listing no longer active (hint)"}
								data-ui-opacity="6"
							/>
						</TypoIcon>
					</Badge>
				)}

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

			{!listing.isActive || listing.my ? null : (
				<TransactionButton
					listing={listing}
					meta={feed.query.meta}
				/>
			)}
		</>
	);
};
