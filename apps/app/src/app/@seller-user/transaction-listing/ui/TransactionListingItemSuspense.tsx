import { type FC, Suspense } from "react";
import { Data } from "./TransactionListingItemSuspense/Data";
import { Pending } from "./TransactionListingItemSuspense/Pending";

export namespace TransactionListingItemSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const TransactionListingItemSuspense: FC<TransactionListingItemSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
