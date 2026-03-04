import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace ListingsLink {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const ListingsLink: FC<ListingsLink.Props> = (props) => {
	return (
		<Suspense fallback={<Pending {...props} />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
