import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace ThumbLikeButton {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const ThumbLikeButton: FC<ThumbLikeButton.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				data-ui={"ThumbLikeButton"}
				{...props}
			/>
		</Suspense>
	);
};
