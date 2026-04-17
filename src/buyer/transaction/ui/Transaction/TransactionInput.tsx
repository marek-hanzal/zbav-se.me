import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { withTransactionQuery } from "~/buyer/transaction/query/withTransactionQuery";
import { archiveSellerMessageActivity } from "~/buyer/transaction/service/archiveSellerMessageActivity";
import { InterestMessage } from "~/buyer/transaction/ui/status/InterestMessage";
import { RejectedMessage } from "~/buyer/transaction/ui/status/RejectedMessage";
import { TransactionMenu } from "~/buyer/transaction/ui/TransactionMenu";
import { getRootLogger } from "~/common/log/getRootLogger";
import { TransactionChat } from "~/user/transaction/ui/TransactionChat";
import { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";

export namespace TransactionInput {
	export interface Props extends MarkSuspense.Props {
		transactionId: string;
	}
}

export const TransactionInput: FC<TransactionInput.Props> = ({ _suspense, transactionId }) => {
	const queryClient = useQueryClient();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);

	useRenderLogger({
		logger: getRootLogger(),
		name: "TransactionInput",
	});

	return match(transaction.status)
		.with("interest", () => {
			return (
				<Container
					ui={{
						flow: "vertical",
						inner: "default",
						gap: "default",
					}}
				>
					<InterestMessage
						close={() => {}}
						transaction={transaction}
					/>
				</Container>
			);
		})
		.with("rejected", () => {
			return (
				<Container
					ui={{
						flow: "vertical",
						inner: "default",
						gap: "default",
					}}
				>
					<RejectedMessage
						close={() => {}}
						transaction={transaction}
					/>
				</Container>
			);
		})
		.otherwise(() => {
			return (
				<TransactionChat
					hooks={{
						async onPostMutation() {
							try {
								await archiveSellerMessageActivity({
									queryClient,
									transactionId: transaction.id,
								});
							} catch {
								// Keep message send flow usable even if unread archival fails.
							}
						},
					}}
					transaction={transaction}
					left={
						<TransactionMenuButton>
							{(close) => (
								<TransactionMenu
									close={close}
									transaction={transaction}
								/>
							)}
						</TransactionMenuButton>
					}
					text={{
						pending: translator.text("Transaction not accepted - buyer (message)"),
						open: translator.text("Transaction - send a message (placeholder)"),
						dispute: translator.text(
							"Transaction - dispute - send a message (placeholder)",
						),
						resolved: translator.text(
							"Transaction - resolved -send a message (placeholder)",
						),
						closed: translator.text("Chat - transaction closed (message)"),
					}}
					ui={{
						inner: "default",
					}}
				/>
			);
		});
};
