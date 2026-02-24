import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/listing/ui/ListingDetail/ListingSellerInfoSuspense/Data";
import { Pending } from "~/app/@buyer-user/listing/ui/ListingDetail/ListingSellerInfoSuspense/Pending";

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
