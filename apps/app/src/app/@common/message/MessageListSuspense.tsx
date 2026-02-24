import { type FC, Suspense } from "react";
import { Data } from "~/app/@common/message/MessageListSuspense/Data";
import { Pending } from "~/app/@common/message/MessageListSuspense/Pending";

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
