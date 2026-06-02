import { type FC, Suspense } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import type { useView } from "@/lib/client/view";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { useListingEvent } from "~/buyer/listing/hook/useListingEvent";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { AttrSection } from "~/common/listing-attr/ui/AttrSection";
import { getRootLogger } from "~/common/log/getRootLogger";
import { FlagButton } from "../FlagButton";
import { IgnoreButton } from "../IgnoreButton";
import { SellerInfo } from "../SellerInfo";
import { ShareButton } from "../ShareButton";
import { ThumbDislikeButton } from "../ThumbDislikeButton";
import { ThumbLikeButton } from "../ThumbLikeButton";
import { HeroSection } from "./section/HeroSection";
import { InfoSection } from "./section/InfoSection";

export namespace ListingCard {
	export interface Props extends Container.Props, MarkSuspense.Props {
		feedId: string;
		listingId: string;
		view: useView.Use<"gallery" | "seller-info">;
	}
}

export const ListingCard: FC<ListingCard.Props> = ({
	_suspense,
	feedId,
	listingId,
	view,
	children,
	...props
}) => {
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

	const disableThump = listing.isIgnored || listing.hasFlag;
	const disableFlags = listing.isFavourite || listing.thumb === "like";

	return (
		<Container
			data-ui={"ListingCard"}
			data-ui-layout="vertical-flex"
			data-ui-gap="xl"
			data-ui-inner="default"
			{...props}
		>
			<HeroSection
				_suspense={_suspense}
				feedId={feedId}
				listing={listing}
				view={view}
			/>

			<InfoSection listing={listing} />

			<AttrSection
				_suspense={_suspense}
				listingId={listing.id}
				categoryId={listing.categoryId}
			/>

			{listing.my ? null : (
				<Group>
					<SellerInfo
						_suspense={"I know"}
						listingId={listing.id}
						view={view}
					/>
				</Group>
			)}

			<Group>
				<ShareButton listingId={listingId} />
			</Group>

			{listing.my ? null : (
				<>
					<Container
						data-ui-layout="horizontal-flex"
						data-ui-width="full"
						data-ui-items="center"
						data-ui-justify="space-evenly"
					>
						<Suspense
							fallback={
								<ThumbLikeButton.Fallback
									listingId={listingId}
									meta={undefined}
									disabled={disableThump || !!listing.thumb}
								/>
							}
						>
							<ThumbLikeButton
								_suspense={"I know"}
								listingId={listingId}
								meta={feed.query.meta}
								disabled={disableThump || !!listing.thumb}
							/>
						</Suspense>

						<Suspense
							fallback={
								<ThumbDislikeButton.Fallback
									listingId={listingId}
									meta={undefined}
									disabled={disableThump || !!listing.thumb}
								/>
							}
						>
							<ThumbDislikeButton
								_suspense={"I know"}
								listingId={listingId}
								meta={feed.query.meta}
								disabled={disableThump || !!listing.thumb}
							/>
						</Suspense>
					</Container>

					<Group>
						<Suspense
							fallback={
								<IgnoreButton.Fallback
									listingId={listingId}
									meta={undefined}
									disabled={disableFlags}
								/>
							}
						>
							<IgnoreButton
								_suspense={"I know"}
								listingId={listingId}
								meta={feed.query.meta}
								disabled={disableFlags}
							/>
						</Suspense>

						<Suspense
							fallback={
								<FlagButton.Fallback
									listingId={listingId}
									meta={undefined}
									disabled={disableFlags}
								/>
							}
						>
							<FlagButton
								_suspense={"I know"}
								listingId={listingId}
								meta={feed.query.meta}
								disabled={disableFlags}
							/>
						</Suspense>
					</Group>
				</>
			)}
		</Container>
	);
};
