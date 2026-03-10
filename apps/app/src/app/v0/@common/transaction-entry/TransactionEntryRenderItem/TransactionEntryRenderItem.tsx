import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace TransactionEntryRenderItem {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const TransactionEntryRenderItem: FC<TransactionEntryRenderItem.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
