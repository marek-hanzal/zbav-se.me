import { Container } from "@use-pico/client/ui/container";
import type { tListing } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { useListingEvent } from "~/app/@buyer-session/listing/hook/useListingEvent";
import { ThumbDislikeButton } from "~/app/@buyer-user/listing/ui/button/ThumbDislikeButton";
import { ThumbLikeButton } from "~/app/@buyer-user/listing/ui/button/ThumbLikeButton";
import { ListingDestructiveActionsSuspense } from "~/app/@buyer-user/listing/ui/listing-detail/ListingDestructiveActionsSuspense";
import { ListingHeroSection } from "~/app/@buyer-user/listing/ui/listing-detail/ListingHeroSection";
import { ListingInfoSection } from "~/app/@buyer-user/listing/ui/listing-detail/ListingInfoSection";

export namespace ListingDetail {
	export type Tools = "destructive" | "hero" | "thumb";

	export interface Hooks {
		onGallery(): void;
		onTransaction(): void;
		onSellerInfo(): void;
	}

	export interface Props extends Container.Props {
		feedId: string | undefined;
		listing: tListing;
		/**
		 * Should the listing emit the score event?
		 */
		withScore: boolean;
		tools: Tools[];
		hooks: Hooks;
	}
}

export const ListingDetail: FC<ListingDetail.Props> = ({
	feedId,
	listing,
	withScore,
	tools,
	ui,
	hooks,
	...props
}) => {
	useListingEvent({
		enabled: withScore,
		listingId: listing.id,
		event: "view",
		timeoutMs: 2_500,
	});

	return (
		<Container
			data-ui={"ListingDetail[Container]"}
			ui={{
				layout: "vertical-flex",
				gap: "xl",
				...ui,
			}}
			{...props}
		>
			{tools.includes("hero") ? (
				<ListingHeroSection
					feedId={feedId}
					listing={listing}
					onGallery={hooks.onGallery}
					onTransaction={hooks.onTransaction}
				/>
			) : null}

			<ListingInfoSection
				listing={listing}
				onSellerInfo={hooks.onSellerInfo}
			/>

			{tools.includes("thumb") ? (
				<Container
					ui={{
						layout: "horizontal-flex",
						width: "full",
						items: "center",
						justify: "space-evenly",
					}}
				>
					<ThumbLikeButton listing={listing} />
					<ThumbDislikeButton listing={listing} />
				</Container>
			) : null}

			{tools.includes("destructive") ? (
				<ListingDestructiveActionsSuspense listingId={listing.id} />
			) : null}
		</Container>
	);
};
