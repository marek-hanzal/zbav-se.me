import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import type { useView } from "@/lib/client/view";
import { AttrSection } from "~/common/listing-attr/ui/AttrSection";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
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
