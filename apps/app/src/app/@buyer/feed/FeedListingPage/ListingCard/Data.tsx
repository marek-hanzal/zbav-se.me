import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import type { FC } from "react";
import { useListingEvent } from "~/app/@buyer/listing/~public/useListingEvent";
import { HeroSection } from "./section/HeroSection";
import { InfoSection } from "./section/InfoSection";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		feedId: string;
		listingId: string;
		onView(view: "gallery" | "seller-info"): void;
	}
}

export const Data: FC<Data.Props> = ({ feedId, listingId, onView, ui, children, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);

	useListingEvent({
		enabled: true,
		listingId,
		event: "view",
		timeoutMs: 2_500,
	});

	return (
		<Container
			data-ui={"ListingDetail[Container]"}
			ui={{
				layout: "vertical-flex",
				gap: "xl",
				inner: "default",
				...ui,
			}}
			{...props}
		>
			<HeroSection
				feedId={feedId}
				listing={listing}
				onView={onView}
			/>

			<InfoSection
				listing={listing}
				onView={onView}
			/>

			{children}
		</Container>
	);
};
