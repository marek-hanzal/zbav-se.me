import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace FavouritesLink {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const FavouritesLink: FC<FavouritesLink.Props> = (props) => {
	return (
		<Suspense fallback={<Pending {...props} />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
