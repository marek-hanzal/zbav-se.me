import { type FC, Suspense } from "react";
import { Data } from "./TransactionEntryListSuspense/Data";
import { Pending } from "./TransactionEntryListSuspense/Pending";

export namespace TransactionEntryListSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const TransactionEntryListSuspense: FC<TransactionEntryListSuspense.Props> = ({
	children,
	...props
}) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			>
				{children}
			</Data>
		</Suspense>
	);
};
