import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace ListingCard {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const ListingCard: FC<ListingCard.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				data-ui={"ListingCard"}
				{...props}
			/>
		</Suspense>
	);
};
