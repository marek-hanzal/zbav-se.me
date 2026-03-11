import type { FC } from "react";
import { Data } from "./Data";

export namespace ListingTransactionHero {
	export interface Props extends Data.Props {
		//
	}
}

export const ListingTransactionHero: FC<ListingTransactionHero.Props> = (props) => {
	return <Data {...props} />;
};
