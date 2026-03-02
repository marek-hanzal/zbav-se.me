import { type FC, Suspense } from "react";
import { Data } from "./ListingDestructiveActionsSuspense/Data";
import { Pending } from "./ListingDestructiveActionsSuspense/Pending";

export namespace ListingDestructiveActionsSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const ListingDestructiveActionsSuspense: FC<ListingDestructiveActionsSuspense.Props> = (
	props,
) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
