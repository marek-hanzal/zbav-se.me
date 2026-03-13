import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction as tBuyerTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { tTransaction as tSellerTransaction } from "@zbav-se.me/sdk/api/seller";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";

export namespace TransactionChat {
	type Status = tBuyerTransaction["status"] | tSellerTransaction["status"];
	export type Mode = "chat" | "readonly";

	export interface Text {
		closed: string;
		dispute: string;
		open: string;
		pending: string;
		resolved: string;
	}

	export interface Transaction {
		id: string;
		status: Status;
	}

	export interface Props extends Container.Props {
		left?: ReactNode;
		resolved: TransactionChat.Mode;
		text: Text;
		transaction: Transaction;
	}
}

export const TransactionChat: FC<TransactionChat.Props> = ({
	left,
	resolved,
	text,
	transaction,
	ui,
	...props
}) => {
	const messageMutation = withTransactionEntryQuery.useCreateMutation({
		invalidate: [
			"collection",
			"count",
		],
	});

	const submit = (message: string) => {
		messageMutation.mutate({
			transactionId: transaction.id,
			kind: "text",
			payload: {
				text: message,
			},
		});
	};

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
							onSubmit={submit}
							placeholder={text.open}
							loading={messageMutation.isPending}
							left={left}
						/>
					);
				})
				.with("resolved", () => {
					return resolved === "chat" ? (
						<ChatInput
							onSubmit={submit}
							placeholder={text.resolved}
							loading={messageMutation.isPending}
							left={left}
						/>
					) : (
						<Container
							data-ui={"TransactionChat[Readonly.resolved]"}
							ui={{
								layout: "horizontal-flex",
								items: "center",
								gap: "md",
								width: "full",
							}}
						>
							{left}

							<Tx
								label={text.resolved}
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
							{left}

							<Tx
								label={text.pending}
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
							onSubmit={submit}
							placeholder={text.dispute}
							loading={messageMutation.isPending}
							left={left}
						/>
					);
				})
				.with("rejected", "sold", "expired", "success", "closed", () => {
					return (
						<Tx
							label={text.closed}
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
