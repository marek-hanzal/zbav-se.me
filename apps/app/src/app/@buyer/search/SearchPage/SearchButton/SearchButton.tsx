import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace SearchButton {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const SearchButton: FC<SearchButton.Props> = (props) => {
	return (
		<Suspense fallback={<Pending {...props} />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
