import { useMemo, useRef } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useElementVisibility, VisibilityProvider } from "@/lib/client/visibility";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { Content } from "./Content";
import { Empty } from "./Data/Empty";

export namespace ListingList {
	export interface Props extends Container.Props {
		//
	}
}

/**
 * Builds the seller listing scroll container, wires visibility tracking, and loads data via suspense.
 * Use it as the main list body for seller listings when visibility-aware rendering is required.
 *
 * @see src/listing/page/MyListingPage.tsx
 */
export const ListingList = withFallback(({ ...props }: ListingList.Props) => {
	const { data: listingCollection } = withListingQuery.useIdsQuery({
		cursor: {
			page: 0,
			size: 100,
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
		] as EmptyState.Check[];
	}, [
		listingCollection,
	]);

	const scrollerRef = useRef<HTMLDivElement | null>(null);
	const visible = useElementVisibility({
		scrollerRef,
		visible: {},
		proximity: {
			overscan: 4,
		},
	});

	return (
		<Container
			data-ui={"MyListing[Container]"}
			ref={scrollerRef}
			ui={{
				flow: "vertical",
				scroll: "vertical",
				height: "full",
				gap: "default",
				inner: "default",
				...ui,
			}}
			{...props}
		>
			<EmptyState check={check}>
				<VisibilityProvider store={visible}>
					<Content
						_suspense={"I know"}
						listingIds={listingCollection}
					/>
				</VisibilityProvider>
			</EmptyState>
		</Container>
	);
}, SpinnerContainer);
