import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace ListingCount {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

/**
 * Resolves listing count data in suspense and exposes a stable wrapper for count presentation.
 * Use it in buyer listing views where total results should be shown with loading-safe behavior.
 *
 * @see apps/app/src/app/@buyer-user/search/page/SearchPage.tsx
 */
export const ListingCount: FC<ListingCount.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
