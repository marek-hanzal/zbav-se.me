import { useMemo, useRef } from "react";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { EmptyState } from "~/ui/ui/EmptyState";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { useElementVisibility } from "~/visibility/hook/useElementVisibility";
import { VisibilityProvider } from "~/visibility/ui/VisibilityProvider";
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
			data-ui={"ListingList[Container]"}
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
