import { type FC, Suspense } from "react";
import { Data } from "./BuyerInfoSuspense/Data";
import { Pending } from "./BuyerInfoSuspense/Pending";

export namespace BuyerInfoSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const BuyerInfoSuspense: FC<BuyerInfoSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
