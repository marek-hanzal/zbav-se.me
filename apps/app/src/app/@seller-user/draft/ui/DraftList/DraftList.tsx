import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace DraftList {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const DraftList: FC<DraftList.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
