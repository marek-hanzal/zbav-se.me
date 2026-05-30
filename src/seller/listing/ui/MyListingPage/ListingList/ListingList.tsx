import { useMemo, useRef } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { useElementVisibility, VisibilityProvider } from "@/lib/client/visibility";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { Content } from "./Content";
import { Empty } from "./Data/Empty";

export namespace ListingList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

/**
 * Builds the seller listing scroll container, wires visibility tracking, and loads data via suspense.
 * Use it as the main list body for seller listings when visibility-aware rendering is required.
 */
export const ListingList = withFallback(({ _suspense, ...props }: ListingList.Props) => {
	const { data: collection } = withListingQuery.useCollectionQuery({
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
					return !collection.length;
				},
				render() {
					return <Empty />;
				},
			},
		] as EmptyState.Check[];
	}, [
		collection,
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
			data-ui={"ListingList"}
			ref={scrollerRef}
			data-ui-flow="vertical"
			data-ui-scroll="vertical"
			data-ui-height="full"
			data-ui-gap="default"
			data-ui-inner="default"
			{...props}
		>
			<EmptyState check={check}>
				<VisibilityProvider store={visible}>
					<Content
						_suspense={_suspense}
						collection={collection}
					/>
				</VisibilityProvider>
			</EmptyState>
		</Container>
	);
}, SpinnerContainer);
