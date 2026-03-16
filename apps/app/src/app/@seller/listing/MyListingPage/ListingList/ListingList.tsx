import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withFallback } from "@use-pico/client/utils";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import { useMemo } from "react";
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
 * @see apps/app/src/app//listing/page/MyListingPage.tsx
 */
export const ListingList = withFallback(({ ui, ...props }: ListingList.Props) => {
	const { data: listingCollection } = withListingQuery.useCollectionQuery({
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

	return (
		<Container
			data-ui={"MyListing[Container]"}
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
				<Content
					_suspense={"I know"}
					listingIds={listingCollection}
				/>
			</EmptyState>
		</Container>
	);
}, SpinnerContainer);
