import { type FC, Suspense } from "react";
import { Data } from "./FavouriteButtonSuspense/Data";
import { Pending } from "./FavouriteButtonSuspense/Pending";

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
