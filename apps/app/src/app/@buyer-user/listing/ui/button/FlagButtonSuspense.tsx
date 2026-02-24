import { type FC, Suspense } from "react";
import { Data } from "./FlagButtonSuspense/Data";
import { Pending } from "./FlagButtonSuspense/Pending";

export namespace FlagButtonSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const FlagButtonSuspense: FC<FlagButtonSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
