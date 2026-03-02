import { type FC, Suspense } from "react";
import { Data } from "./TransactionItemSuspense/Data";
import { Pending } from "./TransactionItemSuspense/Pending";

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
