import { type FC, Suspense } from "react";
import { Data } from "./MessageListSuspense/Data";
import { Pending } from "./MessageListSuspense/Pending";

export namespace MessageListSuspense {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const MessageListSuspense: FC<MessageListSuspense.Props> = ({ children, ...props }) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			>
				{children}
			</Data>
		</Suspense>
	);
};
