import { useState } from "react";
import { Hero } from "~/buyer-feed/ui/ListingList/Item/Hero";
import { ListingSheet } from "~/buyer-feed/ui/ListingSheet";
import { useListingEvent } from "~/buyer-listing/hook/useListingEvent";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";

export namespace Item {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
		feedId: string;
	}
}

export const Item = withFallbackFn(({ _suspense, listingId, feedId }: Item.Props) => {
	const [detail, setDetailFn] = useState<boolean>(false);

	useListingEvent({
		enabled: true,
		listingId: listingId,
		event: "impression",
		timeoutMs: 1_600,
	});

	useRenderLogger({
		logger: getRootLoggerFn(),
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
					setFn: setDetailFn,
				}}
			/>

			<ListingSheet
				_suspense={_suspense}
				feedId={feedId}
				listingId={listingId}
				state={{
					value: detail,
					setFn: setDetailFn,
				}}
			/>
		</>
	);
}, SpinnerContainer);
