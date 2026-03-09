import type { FC } from "react";
import { Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace MessageRenderItem {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const MessageRenderItem: FC<MessageRenderItem.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
