import { type FC, Suspense } from "react";
import { Data } from "~/app/@seller-user/transaction/ui/TransactionItemSuspense/Data";
import { Pending } from "~/app/@seller-user/transaction/ui/TransactionItemSuspense/Pending";

export namespace TransactionItemSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const TransactionItemSuspense: FC<TransactionItemSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
