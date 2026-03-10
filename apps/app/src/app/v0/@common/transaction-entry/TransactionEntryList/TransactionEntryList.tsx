import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace TransactionEntryList {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const TransactionEntryList: FC<TransactionEntryList.Props> = ({
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
