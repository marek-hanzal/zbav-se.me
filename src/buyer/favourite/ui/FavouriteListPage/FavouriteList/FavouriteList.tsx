import { useMemo, useRef } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import type { createVisibilityStore } from "@/lib/client/visibility";
import { useElementVisibility, VisibilityProvider } from "@/lib/client/visibility";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { Content } from "./Content";
import { Empty } from "./Data/Empty";

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

		const { data: listingCollection } = withListingQuery.useIdsQuery({
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
						<Content
							_suspense={"I know"}
							listingIds={listingCollection}
						/>
					</VisibilityProvider>
				</EmptyState>
			</Container>
		);
	},
	SpinnerContainer,
);
