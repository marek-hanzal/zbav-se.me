import { type FC, Suspense } from "react";
import { Data } from "./SellerInfoSuspense/Data";
import { Pending } from "./SellerInfoSuspense/Pending";

export namespace SellerInfoSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const SellerInfoSuspense: FC<SellerInfoSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
