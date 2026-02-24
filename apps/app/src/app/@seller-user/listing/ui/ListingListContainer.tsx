import { useElementVisibility } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tListingQuery } from "@zbav-se.me/sdk/api/seller-user";
import { type FC, Suspense, useRef } from "react";
import { ListingListContent } from "./listing-list-container/ListingListContent";
import { ListingListContentPending } from "./listing-list-container/ListingListContentPending";

export namespace ListingListContainer {
	export interface Props extends Container.Props {
		query: tListingQuery;
	}
}

export const ListingListContainer: FC<ListingListContainer.Props> = ({ query, ...props }) => {
	const scrollerRef = useRef<HTMLDivElement>(null);

	const visibility = useElementVisibility({
		scrollerRef,
		visible: {},
		proximity: {
			overscan: 4,
		},
	});

	return (
		<Container
			data-ui={"MyListing[Container]"}
			ref={scrollerRef}
			ui={{
				layout: "vertical-full",
				snap: "vertical",
				snapAlign: "center",
				height: "full",
			}}
			{...props}
		>
			<Suspense fallback={<ListingListContentPending />}>
				<ListingListContent
					query={query}
					visibility={visibility}
				/>
			</Suspense>
		</Container>
	);
};
