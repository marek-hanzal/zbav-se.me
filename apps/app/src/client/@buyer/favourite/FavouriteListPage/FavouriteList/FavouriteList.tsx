import { VisibilityProvider } from "@use-pico/client/context";
import { useElementVisibility } from "@use-pico/client/hook";
import type { createVisibilityStore } from "@use-pico/client/store";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withFallback } from "@use-pico/client/utils";
import { useMemo, useRef } from "react";
import { withListingQuery } from "~/client/@buyer/listing/withListingQuery";
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

		return (
			<Container
				data-ui={"FavouriteList"}
				ref={scrollerRef}
				ui={{
					flow: "vertical",
					scroll: "vertical",
					height: "full",
					gap: "default",
					inner: "default",
				}}
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
