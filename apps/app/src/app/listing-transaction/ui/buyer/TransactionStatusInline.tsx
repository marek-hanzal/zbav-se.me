import { Tx } from "@use-pico/client/ui/tx";
import type { tListingTransactionStatusEnum } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace TransactionStatusInline {
	export interface Props extends Omit<Tx.Props, "label"> {
		transactionStatus: tListingTransactionStatusEnum;
	}
}

export const TransactionStatusInline: FC<TransactionStatusInline.Props> = ({
	transactionStatus,
	...props
}) => {
	return (
		<Tx
			font={"normal"}
			size={"sm"}
			label={match(transactionStatus)
				.with("request", () => "Transaction requested (label)")
				.with("accepted", () => "Transaction accepted (label)")
				.with("rejected", () => "Transaction rejected (label)")
				.with("success", () => "Transaction successful (label)")
				.with("closed", () => "Transaction closed (label)")
				.with("expired", () => "Transaction expired (label)")
				.exhaustive()}
			{...props}
		/>
	);
};
