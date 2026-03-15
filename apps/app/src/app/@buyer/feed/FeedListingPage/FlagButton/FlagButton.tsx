import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace FlagButton {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const FlagButton: FC<FlagButton.Props> = (props) => {
	return (
		<Suspense fallback={<Pending data-ui={"FlagButton"} />}>
			<Data
				_suspense={"I know"}
				data-ui={"FlagButton"}
				{...props}
			/>
		</Suspense>
	);
};
