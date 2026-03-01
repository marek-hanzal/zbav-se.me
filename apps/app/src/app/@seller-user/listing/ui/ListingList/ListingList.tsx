import { useElementVisibility } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tListingQuery } from "@zbav-se.me/sdk/api/seller-user";
import { type FC, Suspense, useRef } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace ListingList {
	export interface Props extends Container.Props {
		query: tListingQuery;
	}
}

export const ListingList: FC<ListingList.Props> = ({ query, ...props }) => {
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
				flow: "vertical",
				scroll: "vertical",
				height: "full",
				gap: "default",
				inner: "default",
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
