import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace BuyerInfo {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const BuyerInfo: FC<BuyerInfo.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
