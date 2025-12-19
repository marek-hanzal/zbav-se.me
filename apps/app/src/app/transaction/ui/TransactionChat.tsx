import { useQueryClient } from "@tanstack/react-query";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { withMessageTextCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import {
	withMessageThreadMessageCollectionQuery,
	withTransactionFetchQuery,
} from "@zbav-se.me/sdk/query/user";
import { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { TransactionToolbar } from "~/app/transaction/ui/TransactionToolbar";

export namespace TransactionChat {
	export interface Props extends Container.Props {
		transactionId: string;
	}
}

export const TransactionChat: FC<TransactionChat.Props> = ({ transactionId, ui, ...props }) => {
	const queryClient = useQueryClient();
	const messageMutation = withMessageTextCreateMutation.useMutation();

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
			<TransactionToolbar transactionId={transactionId} />

			<withTransactionFetchQuery.Suspense
				data={{
					where: {
						id: transactionId,
					},
				}}
				fallback={<SpinnerContainer />}
			>
				{({ data: transaction }) => {
					return (
						<ChatInput
							onSubmit={(message) => {
								messageMutation.mutate(
									{
										messageThreadId: transaction.messageThreadId,
										message,
									},
									{
										onSuccess() {
											withMessageThreadMessageCollectionQuery.invalidate(
												queryClient,
												{
													path: {
														messageThreadId:
															transaction.messageThreadId,
													},
												},
											);
										},
									},
								);
							}}
							placeholder={translator.text(
								"Transaction - send a message (placeholder)",
							)}
							loading={messageMutation.isPending}
						/>
					);
				}}
			</withTransactionFetchQuery.Suspense>
		</Container>
	);
};
