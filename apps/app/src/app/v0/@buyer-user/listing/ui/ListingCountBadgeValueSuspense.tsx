import { type FC, Suspense } from "react";
import { Data } from "./ListingCountBadgeValueSuspense/Data";
import { Pending } from "./ListingCountBadgeValueSuspense/Pending";

export namespace ListingCountBadgeValueSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const ListingCountBadgeValueSuspense: FC<ListingCountBadgeValueSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
