import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-session/listing/ui/seller-info-suspense/Data";
import { Pending } from "~/app/@buyer-session/listing/ui/seller-info-suspense/Pending";

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
