import { type FC, Suspense } from "react";
import { Data } from "~/app/@seller-session/transaction/ui/buyer-info-suspense/Data";
import { Pending } from "~/app/@seller-session/transaction/ui/buyer-info-suspense/Pending";

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
