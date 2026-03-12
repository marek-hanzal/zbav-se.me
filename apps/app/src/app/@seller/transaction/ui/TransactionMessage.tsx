import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import { match } from "ts-pattern";
import { DisputeMessage } from "./status/DisputeMessage";
import { OpenMessage } from "./status/OpenMessage";
import { PendingMessage } from "./status/PendingMessage";

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
			return <OpenMessage transaction={transaction} />;
		})
		.with("dispute", () => {
			return <DisputeMessage transaction={transaction} />;
		})
		.with("rejected", "resolved", "sold", "expired", "success", "closed", () => {
			return null;
		})
		.exhaustive();

	return message ? <Container {...props}>{message}</Container> : null;
};
