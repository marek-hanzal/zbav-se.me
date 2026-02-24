import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/feed-favourite/ui/favourite-list-container-suspense/Data";
import { Pending } from "~/app/@buyer-user/feed-favourite/ui/favourite-list-container-suspense/Pending";

export namespace FavouriteListContainerSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const FavouriteListContainerSuspense: FC<FavouriteListContainerSuspense.Props> = (
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
