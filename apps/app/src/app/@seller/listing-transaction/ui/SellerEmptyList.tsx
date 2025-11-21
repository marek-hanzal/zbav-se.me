import { Status } from "@use-pico/client/ui/status";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace SellerEmptyList {
	export interface Props extends Status.Props {
		//
	}
}

export const SellerEmptyList: FC<SellerEmptyList.Props> = (props) => {
	return (
		<Status
			icon={TransactionIcon}
			textTitle={"No transactions found - seller (title)"}
			textMessage={"No transactions found - seller (message)"}
			{...props}
		/>
	);
};
