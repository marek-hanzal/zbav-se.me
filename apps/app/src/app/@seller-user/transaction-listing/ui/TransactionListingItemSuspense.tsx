import { type FC, Suspense } from "react";
import { Data } from "~/app/@seller-user/transaction-listing/ui/transaction-listing-item-suspense/Data";
import { Pending } from "~/app/@seller-user/transaction-listing/ui/transaction-listing-item-suspense/Pending";

export namespace TransactionListingItemSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const TransactionListingItemSuspense: FC<TransactionListingItemSuspense.Props> = (
	props,
) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
