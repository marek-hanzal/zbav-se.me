import { Icon } from "@use-pico/client/icon";
import type { tTransactionStatusEnum } from "@zbav-se.me/sdk/api/user";
import { CancelIcon, CheckIcon, SentIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

const StatusIconMap: Record<tTransactionStatusEnum, Icon.Type> = {
	request: SentIcon,
	accepted: CheckIcon,
	rejected: CancelIcon,
	success: CheckIcon,
	closed: CheckIcon,
	expired: CheckIcon,
};

export namespace TransactionStatusIcon {
	export interface Props extends Icon.PropsEx {
		transactionStatus: tTransactionStatusEnum;
	}
}

export const TransactionStatusIcon: FC<TransactionStatusIcon.Props> = ({
	transactionStatus,
	...props
}) => {
	return (
		<Icon
			icon={StatusIconMap[transactionStatus]}
			{...props}
		/>
	);
};
