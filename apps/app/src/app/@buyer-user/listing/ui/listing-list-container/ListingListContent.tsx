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
import { type FC, type ReactNode, Suspense } from "react";
import type { ListingListContainer } from "../ListingListContainer";
import { ListingItem } from "./ListingItem";

export namespace ListingListContent {
	export interface Props {
		query: tListingQuery;
		renderEmptyFn?: ListingListContainer.Props["renderEmptyFn"];
		appendix?: ReactNode;
		feedId: string;
		withScore: boolean;
		visibility: ReturnType<typeof useElementVisibility>;
	}
}

export const ListingListContent: FC<ListingListContent.Props> = ({
	query,
	renderEmptyFn,
	appendix,
	feedId,
	withScore,
	visibility,
}) => {
	const locale = useLocale();
	const listingCollectionQuery = withListingQuery.useCollectionQuery(query);

	if (listingCollectionQuery.data.length === 0) {
		return renderEmptyFn ? (
			renderEmptyFn()
		) : (
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
					<Suspense
						fallback={
							<SpinnerContainer
								data-ui={"ListingListContainer-[SpinnerContainer.listing-fetch]"}
							/>
						}
					>
						<ListingItem
							listingId={listingId}
							feedId={feedId}
							withScore={withScore}
						/>
					</Suspense>
				</VisibleContainer>
			))}

			{appendix}
		</VisibilityProvider>
	);
};
