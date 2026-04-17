import { Suspense } from "react";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { Group } from "@/lib/client/group";
import { useRenderLogger } from "@/lib/client/log";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { useListingEvent } from "~/buyer/listing/hook/useListingEvent";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { getRootLogger } from "~/common/log/getRootLogger";
import { FlagButton } from "../FlagButton";
import { IgnoreButton } from "../IgnoreButton";
import { ThumbDislikeButton } from "../ThumbDislikeButton";
import { ThumbLikeButton } from "../ThumbLikeButton";
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
		const { data: feed } = withFeedQuery.useFetchQuery(feedId);
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

				{listing.isIgnored || listing.hasFlag || listing.my ? null : (
					<Container
						ui={{
							layout: "horizontal-flex",
							width: "full",
							items: "center",
							justify: "space-evenly",
						}}
					>
						<Suspense
							fallback={
								<ThumbLikeButton.Fallback
									listingId={listingId}
									meta={undefined}
								/>
							}
						>
							<ThumbLikeButton
								_suspense={"I know"}
								listingId={listingId}
								meta={feed.query.meta}
							/>
						</Suspense>
						<Suspense
							fallback={
								<ThumbDislikeButton.Fallback
									listingId={listingId}
									meta={undefined}
								/>
							}
						>
							<ThumbDislikeButton
								_suspense={"I know"}
								listingId={listingId}
								meta={feed.query.meta}
							/>
						</Suspense>
					</Container>
				)}

				{listing.isFavourite || listing.thumb === "like" || listing.my ? null : (
					<Group>
						<Suspense
							fallback={
								<IgnoreButton.Fallback
									listingId={listingId}
									meta={undefined}
								/>
							}
						>
							<IgnoreButton
								_suspense={"I know"}
								listingId={listingId}
								meta={feed.query.meta}
							/>
						</Suspense>

						<Suspense
							fallback={
								<FlagButton.Fallback
									listingId={listingId}
									meta={undefined}
								/>
							}
						>
							<FlagButton
								_suspense={"I know"}
								listingId={listingId}
								meta={feed.query.meta}
							/>
						</Suspense>
					</Group>
				)}
			</Container>
		);
	},
	SpinnerContainer,
);
