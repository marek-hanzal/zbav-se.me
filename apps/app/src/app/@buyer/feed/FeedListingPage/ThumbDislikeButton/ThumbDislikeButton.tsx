import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace ThumbDislikeButton {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const ThumbDislikeButton: FC<ThumbDislikeButton.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				data-ui={"ThumbDislikeButton"}
				{...props}
			/>
		</Suspense>
	);
};
