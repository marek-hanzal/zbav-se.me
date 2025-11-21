import { Status } from "@use-pico/client/ui/status";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace EmptyList {
	export interface Props extends Status.Props {
		//
	}
}

export const EmptyList: FC<EmptyList.Props> = (props) => {
	return (
		<Status
			icon={TransactionIcon}
			textTitle={"No transactions found (title)"}
			textMessage={"No transactions found (message)"}
			{...props}
		/>
	);
};
