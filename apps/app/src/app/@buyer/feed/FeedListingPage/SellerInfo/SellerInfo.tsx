import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace SellerInfo {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const SellerInfo: FC<SellerInfo.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				data-ui={"SellerInfo"}
				{...props}
			/>
		</Suspense>
	);
};
