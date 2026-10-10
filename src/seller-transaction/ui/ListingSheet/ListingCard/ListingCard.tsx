import type { FC } from "react";
import { AttrSection } from "~/listing-attr/ui/AttrSection";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withListingQuery } from "~/seller-listing/query/withListingQuery";
import { HeroSection } from "~/seller-transaction/ui/ListingSheet/ListingCard/HeroSection";
import { InfoSection } from "~/seller-transaction/ui/ListingSheet/ListingCard/InfoSection";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import type { useView } from "~/view/hook/useView";

export namespace ListingCard {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
		view: useView.Use<"gallery">;
	}
}

export const ListingCard: FC<ListingCard.Props> = ({
	_suspense,
	listingId,
	view,
	children,
	...props
}) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);

	useRenderLogger({
		logger: getRootLogger(),
		name: "ListingCard",
		meta: {
			listingId,
		},
	});

	return (
		<Container
			data-ui={"ListingCard"}
			data-ui-layout="vertical-flex"
			data-ui-gap="xl"
			data-ui-inner="default"
			{...props}
		>
			<HeroSection
				listing={listing}
				view={view}
			/>

			<InfoSection listing={listing} />

			<AttrSection
				_suspense={_suspense}
				listingId={listing.id}
				categoryId={listing.categoryId}
			/>
		</Container>
	);
};
