import { useState } from "react";
import { withFallback } from "@/lib/client/fallback";
import { useRenderLogger } from "@/lib/client/log";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { useListingEvent } from "~/buyer/listing/hook/useListingEvent";
import { getRootLogger } from "~/common/log/getRootLogger";
import { ListingSheet } from "../../ListingSheet";
import { Hero } from "./Hero";

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
				isOpen={detail}
				onClose={() => setDetail(false)}
			/>
		</>
	);
}, SpinnerContainer);
