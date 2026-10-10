import { useState } from "react";
import { Hero } from "~/buyer-feed/ui/ListingList/Item/Hero";
import { ListingSheet } from "~/buyer-feed/ui/ListingSheet";
import { useListingEvent } from "~/buyer-listing/hook/useListingEvent";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withFallback } from "~/ui/fn/withFallback";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";

export namespace Item {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
		feedId: string;
	}
}

export const Item = withFallback(({ _suspense, listingId, feedId }: Item.Props) => {
	const [detail, setDetail] = useState<boolean>(false);

	useListingEvent({
		enabled: true,
		listingId: listingId,
		event: "impression",
		timeoutMs: 1_600,
	});

	useRenderLogger({
		logger: getRootLogger(),
		name: "Item",
		meta: {
			listingId,
		},
	});

	return (
		<>
			<Hero
				_suspense={_suspense}
				listingId={listingId}
				listingState={{
					value: detail,
					set: setDetail,
				}}
			/>

			<ListingSheet
				_suspense={_suspense}
				feedId={feedId}
				listingId={listingId}
				state={{
					value: detail,
					set: setDetail,
				}}
			/>
		</>
	);
}, SpinnerContainer);
