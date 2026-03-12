import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { match } from "ts-pattern";
import { TransactionMenuButton } from "~/app/@common/transaction/ui";
import { TransactionMenu } from "./TransactionMenu";

export namespace TransactionChat {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const TransactionChat: FC<TransactionChat.Props> = ({ transaction, ui, ...props }) => {
	const messageMutation = withTransactionEntryQuery.useCreateMutation({
		invalidate: [
			"collection",
			"count",
		],
	});

	return (
		<Container
			data-ui="TransactionChat[Container]"
			ui={{
				layout: "vertical-flex",
				width: "full",
				...ui,
			}}
			{...props}
		>
			{match(transaction.status)
				.with("open", () => {
					return (
						<ChatInput
							onSubmit={(message) => {
								messageMutation.mutate({
									transactionId: transaction.id,
									kind: "text",
									payload: {
										text: message,
									},
								});
							}}
							placeholder={translator.text(
								"Transaction - send a message (placeholder)",
							)}
							loading={messageMutation.isPending}
							left={
								<TransactionMenuButton>
									<TransactionMenu transaction={transaction} />
								</TransactionMenuButton>
							}
						/>
					);
				})
				.with("resolved", () => {
					return (
						<ChatInput
							onSubmit={(message) => {
								messageMutation.mutate({
									transactionId: transaction.id,
									kind: "text",
									payload: {
										text: message,
									},
								});
							}}
							placeholder={translator.text(
								"Transaction - resolved -send a message (placeholder)",
							)}
							loading={messageMutation.isPending}
							left={
								<TransactionMenuButton>
									<TransactionMenu transaction={transaction} />
								</TransactionMenuButton>
							}
						/>
					);
				})
				.with("pending", () => {
					return (
						<Container
							data-ui={"TransactionChat[Readonly.pending]"}
							ui={{
								layout: "horizontal-flex",
								items: "center",
								gap: "md",
								width: "full",
							}}
						>
							<TransactionMenuButton>
								<TransactionMenu transaction={transaction} />
							</TransactionMenuButton>

							<Tx
								label={"Transaction not accepted - buyer (message)"}
								ui={{
									width: "full",
									text: "sm",
									opacity: "6",
								}}
								className="text-center"
							/>
						</Container>
					);
				})
				.with("dispute", () => {
					return (
						<ChatInput
							onSubmit={(message) => {
								messageMutation.mutate({
									transactionId: transaction.id,
									kind: "text",
									payload: {
										text: message,
									},
								});
							}}
							placeholder={translator.text(
								"Transaction - dispute - send a message (placeholder)",
							)}
							loading={messageMutation.isPending}
							left={
								<TransactionMenuButton>
									<TransactionMenu transaction={transaction} />
								</TransactionMenuButton>
							}
						/>
					);
				})
				.with("rejected", "sold", "expired", "success", "closed", () => {
					return (
						<Tx
							label={"Chat - transaction closed (message)"}
							ui={{
								width: "full",
								text: "sm",
								opacity: "6",
							}}
							className="text-center"
						/>
					);
				})
				.exhaustive()}
		</Container>
	);
};
