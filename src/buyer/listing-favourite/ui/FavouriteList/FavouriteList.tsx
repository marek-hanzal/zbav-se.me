import { useCallback, useMemo, useRef } from "react";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { ListItemPending } from "~/common/list-item/ListItemPending";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { EmptyState } from "~/ui/ui/EmptyState";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import type { createVisibilityStore } from "~/visibility/fn/createVisibilityStore";
import { useElementVisibility } from "~/visibility/hook/useElementVisibility";
import { VisibilityProvider } from "~/visibility/ui/VisibilityProvider";
import { VisibleContainer } from "~/visibility/ui/VisibleContainer";
import { Empty } from "./Empty";
import { Item } from "./Item";

export namespace FavouriteList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		visibility?: createVisibilityStore.Hook;
	}
}

export const FavouriteList = withFallback(
	({ _suspense, visibility, ...props }: FavouriteList.Props) => {
		const scrollerRef = useRef<HTMLDivElement>(null);

		const visibilityStore =
			visibility ??
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
					check() {
						return !listingCollection.length;
					},
					render() {
						return <Empty />;
					},
				},
			] satisfies EmptyState.Check[];
		}, [
			listingCollection,
		]);

		const placeholder = useCallback(() => <ListItemPending />, []);

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
					<VisibilityProvider store={visibilityStore}>
						{listingCollection.map((listing) => {
							return (
								<VisibleContainer
									key={listing.id}
									id={listing.id}
									placeholder={placeholder}
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
