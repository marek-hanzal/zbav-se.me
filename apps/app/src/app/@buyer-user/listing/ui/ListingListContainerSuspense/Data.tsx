import { VisibilityProvider } from "@use-pico/client/context";
import { type useElementVisibility, useLocale } from "@use-pico/client/hook";
import { ChevronLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { SpinnerContainer, VisibleContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import type { tListingQuery } from "@zbav-se.me/sdk/api/buyer-user";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import type { FC, ReactNode } from "react";
import type { ListingListContainerSuspense } from "../ListingListContainerSuspense";
import { ListingItemSuspense } from "./ListingItemSuspense";

export namespace Data {
	export interface Props {
		query: tListingQuery;
		renderEmptyFn?: ListingListContainerSuspense.Props["renderEmptyFn"];
		appendix?: ReactNode;
		feedId: string;
		withScore: boolean;
		visibility: ReturnType<typeof useElementVisibility>;
	}
}

export const Data: FC<Data.Props> = ({
	query,
	renderEmptyFn,
	appendix,
	feedId,
	withScore,
	visibility,
}) => {
	const locale = useLocale();
	const listingCollectionQuery = withListingQuery.useCollectionQuery(query);
	const { data: listingCount } = withListingQuery.useCount(query);

	if (listingCount.isEmpty) {
		return (
			<Status
				data-ui={"ListingListContainer-[Status.empty]"}
				key={"no-listings"}
				icon={"icon-[streamline--sad-face-remix]"}
				textTitle={translator.text("No listings (title)")}
				action={
					<LinkTo
						to={"/$locale/flow/home"}
						params={{
							locale,
						}}
					>
						<Button
							iconEnabled={ChevronLeftIcon}
							label={translator.text("Back to home (link)")}
							ui={{
								tone: "secondary",
							}}
						/>
					</LinkTo>
				}
			/>
		);
	}

	if (listingCount.isFilterEmpty) {
		return renderEmptyFn ? (
			renderEmptyFn()
		) : (
			<Status
				data-ui={"ListingListContainer-[Status.filter-empty]"}
				key={"no-listings-for-current-filter"}
				icon={"icon-[streamline--sad-face-remix]"}
				textTitle={translator.text("No listings for current filter (title)")}
				textMessage={translator.text("No listings for current filter (message)")}
			/>
		);
	}

	return (
		<VisibilityProvider store={visibility}>
			{listingCollectionQuery.data.map((listingId) => (
				<VisibleContainer
					key={listingId}
					id={listingId}
					data-ui="ListingListContainer-[VisibleContainer]"
					placeholder={() => (
						<SpinnerContainer
							data-ui={"ListingListContainer-[SpinnerContainer.placeholder]"}
							data-id={listingId}
						/>
					)}
					ui={{
						height: "full",
						width: "full",
					}}
				>
					<ListingItemSuspense
						listingId={listingId}
						feedId={feedId}
						withScore={withScore}
					/>
				</VisibleContainer>
			))}

			{appendix}
		</VisibilityProvider>
	);
};
