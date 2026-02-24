import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/listing/ui/listing-detail/listing-seller-info-suspense/Data";
import { Pending } from "~/app/@buyer-user/listing/ui/listing-detail/listing-seller-info-suspense/Pending";

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
