import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/listing/ui/listing-list-container-suspense/listing-item-suspense/Data";
import { Pending } from "~/app/@buyer-user/listing/ui/listing-list-container-suspense/listing-item-suspense/Pending";

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
