import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/listing/ui/ListingListContainerSuspense/ListingItemSuspense/Data";
import { Pending } from "~/app/@buyer-user/listing/ui/ListingListContainerSuspense/ListingItemSuspense/Pending";

export namespace ListingItemSuspense {
	export interface Props extends Data.Props {
		//
	}
}

export const ListingItemSuspense: FC<ListingItemSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data {...props} />
		</Suspense>
	);
};
