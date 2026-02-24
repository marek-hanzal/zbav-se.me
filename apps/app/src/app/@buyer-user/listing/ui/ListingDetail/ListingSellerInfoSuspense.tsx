import { type FC, Suspense } from "react";
import { Data } from "./ListingSellerInfoSuspense/Data";
import { Pending } from "./ListingSellerInfoSuspense/Pending";

export namespace ListingSellerInfoSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const ListingSellerInfoSuspense: FC<ListingSellerInfoSuspense.Props> = ({
	onSellerInfo,
	...props
}) => {
	return (
		<Suspense fallback={<Pending onSellerInfo={onSellerInfo} />}>
			<Data
				_suspense={"I know"}
				onSellerInfo={onSellerInfo}
				{...props}
			/>
		</Suspense>
	);
};
