import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace IgnoreButton {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const IgnoreButton: FC<IgnoreButton.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
