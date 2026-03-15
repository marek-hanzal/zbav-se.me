import { VisibilityProvider } from "@use-pico/client/context";
import { useElementVisibility, useMergeRefs, useScrollTo } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import {
	Container,
	SpinnerContainer,
	VisibleContainer,
	SpinnerContainer as VisibleSpinnerContainer,
} from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withFallback } from "@use-pico/client/utils";
import type { tListingQuery } from "@zbav-se.me/sdk/api/buyer";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { type ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { Empty } from "./Empty";
import { FilterEmpty } from "./FilterEmpty";
import { Item } from "./Item/Item";

export namespace ListingList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tListingQuery;
		/**
		 * Listing ID to scroll to
		 */
		scrollToId: string | undefined;
		appendix?: ReactNode;
		feedId: string;
		withScore: boolean;
	}
}

export const ListingList = withFallback(
	({ ref, query, scrollToId, appendix, feedId, withScore, ...props }: ListingList.Props) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const mergedRef = useMergeRefs([
			containerRef,
			ref,
		]);

		const scrollTo = useScrollTo(containerRef);

		useEffect(() => {
			if (!scrollToId || !containerRef.current) {
				return;
			}
			scrollTo(`[data-id="${scrollToId}"]`, {
				behavior: "instant",
			});
		}, [
			scrollToId,
			scrollTo,
		]);

		const visibility = useElementVisibility({
			scrollerRef: containerRef,
			visible: {},
			proximity: {
				overscan: 4,
			},
		});

		const { data: listingCollection } = withListingQuery.useCollectionQuery(query);
		const { data: listingCount } = withListingQuery.useCountQuery(query);
		const check = useMemo(() => {
			return [
				{
					check() {
						return listingCount.isEmpty;
					},
					render() {
						return <Empty />;
					},
				},
				{
					check() {
						return listingCount.isFilterEmpty;
					},
					render() {
						return <FilterEmpty />;
					},
				},
			] satisfies EmptyState.Check[];
		}, [
			listingCount,
		]);

		const placeholder = useCallback(() => {
			return <VisibleSpinnerContainer />;
		}, []);

		return (
			<Container
				ref={mergedRef}
				data-ui={"ListingList"}
				ui={{
					layout: "vertical-full",
					snap: "vertical",
					snapAlign: "center",
					height: "full",
				}}
				{...props}
			>
				<EmptyState check={check}>
					<VisibilityProvider store={visibility}>
						{listingCollection.map((listingId) => (
							<VisibleContainer
								key={listingId}
								id={listingId}
								data-id={listingId}
								placeholder={placeholder}
								ui={{
									height: "full",
									width: "full",
								}}
							>
								<Item
									listingId={listingId}
									feedId={feedId}
									withScore={withScore}
								/>
							</VisibleContainer>
						))}

						{appendix}
					</VisibilityProvider>
				</EmptyState>
			</Container>
		);
	},
	SpinnerContainer,
);
