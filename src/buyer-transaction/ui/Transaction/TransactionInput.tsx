import type { FC } from "react";
import { match } from "ts-pattern";
import { withTransactionQuery } from "~/buyer-transaction/query/withTransactionQuery";
import { RejectedMessage } from "~/buyer-transaction/ui/RejectedMessage";
import { TransactionMenu } from "~/buyer-transaction/ui/TransactionMenu";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { useTranslator } from "~/translation/hook/useTranslator";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { TransactionChat } from "~/user-transaction/ui/TransactionChat";
import { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace TransactionInput {
	export interface Props extends MarkSuspense.Props {
		transactionId: string;
	}
}

export const TransactionInput: FC<TransactionInput.Props> = ({ _suspense, transactionId }) => {
	const translator = useTranslator();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);

	useRenderLogger({
		logger: getRootLogger(),
		name: "TransactionInput",
	});

	return match(transaction.status)
		.with("rejected", () => {
			return (
				<Container
					data-ui-flow="vertical"
					data-ui-inner="default"
					data-ui-gap="default"
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
						pending: translator.text("Transaction - send a message (placeholder)"),
						open: translator.text("Transaction - send a message (placeholder)"),
						dispute: translator.text(
							"Transaction - dispute - send a message (placeholder)",
						),
						resolved: translator.text(
							"Transaction - resolved -send a message (placeholder)",
						),
						closed: translator.text("Chat - transaction closed (message)"),
					}}
					data-ui-inner="default"
				/>
			);
		});
};
