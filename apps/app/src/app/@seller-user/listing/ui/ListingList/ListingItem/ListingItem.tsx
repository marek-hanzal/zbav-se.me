import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace ListingItem {
	export interface Props extends Data.Props {
		//
	}
}

export const ListingItem: FC<ListingItem.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data {...props} />
		</Suspense>
	);
};
