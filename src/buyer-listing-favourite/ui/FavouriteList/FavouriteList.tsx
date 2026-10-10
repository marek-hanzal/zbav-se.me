import { useCallback, useMemo, useRef } from "react";
import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import { Empty } from "~/buyer-listing-favourite/ui/FavouriteList/Empty";
import { Item } from "~/buyer-listing-favourite/ui/FavouriteList/Item";
import { ListItemPending } from "~/list-item/ui/ListItemPending";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { EmptyState } from "~/ui/ui/EmptyState";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import type { createVisibilityStoreFn } from "~/visibility/fn/createVisibilityStoreFn";
import { useElementVisibility } from "~/visibility/hook/useElementVisibility";
import { VisibilityProvider } from "~/visibility/ui/VisibilityProvider";
import { VisibleContainer } from "~/visibility/ui/VisibleContainer";

export namespace FavouriteList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		visibilityFn?: createVisibilityStoreFn.Hook;
	}
}

export const FavouriteList = withFallbackFn(
	({ _suspense, visibilityFn, ...props }: FavouriteList.Props) => {
		const scrollerRef = useRef<HTMLDivElement>(null);

		const visibilityStoreFn =
			visibilityFn ??
			useElementVisibility({
				scrollerRef,
				visible: {},
				proximity: {
					overscan: 4,
				},
			});

		const { data: listingCollection } = withListingQuery.useCollectionQuery({
			where: {
				isFavourite: true,
				withIgnored: false,
			},
			sort: [
				{
					field: "createdAt",
					order: "desc",
				},
			],
		});

		const check = useMemo(() => {
			return [
				{
					checkFn() {
						return !listingCollection.length;
					},
					renderFn() {
						return <Empty />;
					},
				},
			] satisfies EmptyState.Check[];
		}, [
			listingCollection,
		]);

		const placeholderFn = useCallback(() => <ListItemPending />, []);

		return (
			<Container
				data-ui={"FavouriteList[Container]"}
				ref={scrollerRef}
				data-ui-flow="vertical"
				data-ui-scroll="vertical"
				data-ui-height="full"
				data-ui-gap="default"
				data-ui-inner="default"
				{...props}
			>
				<EmptyState check={check}>
					<VisibilityProvider storeFn={visibilityStoreFn}>
						{listingCollection.map((listing) => {
							return (
								<VisibleContainer
									key={listing.id}
									id={listing.id}
									placeholderFn={placeholderFn}
								>
									<Item listing={listing} />
								</VisibleContainer>
							);
						})}
					</VisibilityProvider>
				</EmptyState>
			</Container>
		);
	},
	SpinnerContainer,
);
