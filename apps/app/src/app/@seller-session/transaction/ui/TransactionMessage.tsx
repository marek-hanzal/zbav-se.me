import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller-user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { PendingMessage } from "~/app/@seller-session/transaction/ui/PendingMessage";
import { DisputeMessage } from "~/app/transaction/ui/transaction-status/DisputeMessage";
import { OpenMessage } from "~/app/transaction/ui/transaction-status/OpenMessage";

export namespace TransactionMessage {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const TransactionMessage: FC<TransactionMessage.Props> = ({ transaction, ...props }) => {
	const message = match(transaction.status)
		.with("pending", () => {
			return <PendingMessage transaction={transaction} />;
		})
		.with("open", () => {
			return <OpenMessage transaction={transaction as import("@zbav-se.me/sdk/api/buyer-user").tTransaction} />;
		})
		.with("dispute", () => {
			return <DisputeMessage transaction={transaction as import("@zbav-se.me/sdk/api/buyer-user").tTransaction} />;
		})
		.with("rejected", "resolved", "expired", "success", "closed", () => {
			return null;
		})
		.exhaustive();

	return message ? <Container {...props}>{message}</Container> : null;
};
