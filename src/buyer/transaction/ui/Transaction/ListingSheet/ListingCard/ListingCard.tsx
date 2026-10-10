import type { FC } from "react";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { AttrSection } from "~/common/listing-attr/ui/AttrSection";
import { getRootLogger } from "~/common/log/getRootLogger";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import type { useView } from "~/view/hook/useView";
import { HeroSection } from "./section/HeroSection";
import { InfoSection } from "./section/InfoSection";

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
