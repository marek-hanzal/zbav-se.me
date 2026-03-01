import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace ListingCount {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

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
