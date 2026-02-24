import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/listing/ui/listing-detail/listing-destructive-actions-suspense/Data";
import { Pending } from "~/app/@buyer-user/listing/ui/listing-detail/listing-destructive-actions-suspense/Pending";

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
