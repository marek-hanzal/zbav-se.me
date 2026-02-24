import { useElementVisibility } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tListingQuery } from "@zbav-se.me/sdk/api/seller-user";
import { type FC, Suspense, useRef } from "react";
import { Data } from "./listing-list-container-suspense/Data";
import { Pending } from "./listing-list-container-suspense/Pending";

export namespace ListingListContainerSuspense {
	export interface Props extends Container.Props {
		query: tListingQuery;
	}
}

export const ListingListContainerSuspense: FC<ListingListContainerSuspense.Props> = ({
	query,
	...props
}) => {
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
			<Suspense fallback={<Pending />}>
				<Data
					query={query}
					visibility={visibility}
				/>
			</Suspense>
		</Container>
	);
};
