import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { useRenderLogger } from "@/lib/client/log";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { useListingEvent } from "~/buyer/listing/hook/useListingEvent";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { getRootLogger } from "~/common/log/getRootLogger";
import { HeroSection } from "./section/HeroSection";
import { InfoSection } from "./section/InfoSection";

export namespace ListingCard {
	export interface Props extends Container.Props, MarkSuspense.Props {
		feedId: string;
		listingId: string;
		onView(view: "gallery" | "seller-info"): void;
	}
}

export const ListingCard = withFallback(
	({ _suspense, feedId, listingId, onView, ui, children, ...props }: ListingCard.Props) => {
		const { data: listing } = withListingQuery.useFetchQuery(listingId);

		useListingEvent({
			enabled: true,
			listingId,
			event: "view",
			timeoutMs: 2_500,
		});

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
				ui={{
					layout: "vertical-flex",
					gap: "xl",
					inner: "default",
					...ui,
				}}
				{...props}
			>
				<HeroSection
					_suspense={_suspense}
					feedId={feedId}
					listing={listing}
					onView={onView}
				/>

				<InfoSection
					_suspense={_suspense}
					listing={listing}
					onView={onView}
				/>

				{children}
			</Container>
		);
	},
	SpinnerContainer,
);
