import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace ListingItem {
	export interface Props extends Data.Props {
		//
	}
}

/**
 * Wraps one seller listing row in suspense so item-level data can resolve with isolated fallback.
 * Use it inside virtualized or incremental listing collections where each item may load independently.
 *
 * @see apps/app/src/app//listing/MyListingPage/ListingList/ListingList.tsx
 */
export const ListingItem: FC<ListingItem.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data {...props} />
		</Suspense>
	);
};
