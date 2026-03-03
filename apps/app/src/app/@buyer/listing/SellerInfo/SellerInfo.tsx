import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace SellerInfo {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

/**
 * Wraps seller profile details in suspense so listing-level seller data can resolve asynchronously.
 * Use it inside listing detail flows when buyer context needs seller metadata without blocking the surrounding UI.
 *
 * @see apps/app/src/app//listing/ui/SellerInfoButton.tsx
 */
export const SellerInfo: FC<SellerInfo.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
