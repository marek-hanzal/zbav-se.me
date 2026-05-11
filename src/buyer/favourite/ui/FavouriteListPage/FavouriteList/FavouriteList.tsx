import { useCallback, useMemo, useRef } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import type { createVisibilityStore } from "@/lib/client/visibility";
import {
	useElementVisibility,
	VisibilityProvider,
	VisibleContainer,
} from "@/lib/client/visibility";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { ListItemPending } from "~/common/list-item/ListItemPending";
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
				data-ui={"FavouriteList"}
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
