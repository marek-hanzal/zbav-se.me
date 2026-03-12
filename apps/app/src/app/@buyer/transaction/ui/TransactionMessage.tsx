import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
import { match } from "ts-pattern";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { DisputeMessage } from "./status/DisputeMessage";
import { OpenMessage } from "./status/OpenMessage";
import { PendingMessage } from "./status/PendingMessage";

export namespace TransactionMessage {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const TransactionMessage: FC<TransactionMessage.Props> = ({
	close,
	transaction,
	ui,
	...props
}) => {
	const message = match(transaction.status)
		.with("pending", () => {
			return (
				<PendingMessage
					close={close}
					transaction={transaction}
				/>
			);
		})
		.with("open", () => {
			return (
				<OpenMessage
					close={close}
					transaction={transaction}
				/>
			);
		})
		.with("dispute", () => {
			return (
				<DisputeMessage
					close={close}
					transaction={transaction}
				/>
			);
		})
		.with("rejected", "resolved", "sold", "expired", "success", "closed", () => {
			return null;
		})
		.exhaustive();

	return message ? (
		<Container
			ui={{
				flow: "vertical",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			{message}
		</Container>
	) : null;
};
