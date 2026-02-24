import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/listing/ui/button/FavouriteButtonSuspense/Data";
import { Pending } from "~/app/@buyer-user/listing/ui/button/FavouriteButtonSuspense/Pending";

export namespace FavouriteButtonSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const FavouriteButtonSuspense: FC<FavouriteButtonSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
