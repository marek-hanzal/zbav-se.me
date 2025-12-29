import { useQueryClient } from "@tanstack/react-query";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { withTransactionMessageTextCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import {
	withMessageThreadMessageCollectionQuery,
	withTransactionFetchQuery,
} from "@zbav-se.me/sdk/query/user";
import { ChatInput } from "@zbav-se.me/ui/chat";
import type { FC } from "react";
import { match } from "ts-pattern";
import { useSide } from "~/app/user/useSide";

export namespace TransactionChat {
	export interface Props extends Container.Props {
		transactionId: string;
	}
}

export const TransactionChat: FC<TransactionChat.Props> = ({ transactionId, ui, ...props }) => {
	const side = useSide();
	const queryClient = useQueryClient();
	const messageMutation = withTransactionMessageTextCreateMutation.useMutation();

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
			<withTransactionFetchQuery.Suspense
				data={{
					where: {
						id: transactionId,
					},
				}}
				fallback={<SpinnerContainer />}
			>
				{({ data: transaction }) => {
					return match(transaction.status)
						.with("open", () => {
							return (
								<ChatInput
									onSubmit={(message) => {
										messageMutation.mutate(
											{
												transactionId,
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
						})
						.with("resolved", () => {
							return (
								<ChatInput
									onSubmit={(message) => {
										messageMutation.mutate(
											{
												transactionId,
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
										"Transaction - resolved -send a message (placeholder)",
									)}
									loading={messageMutation.isPending}
								/>
							);
						})
						.with("pending", () => {
							return (
								<Tx
									label={
										side === "seller"
											? "Transaction not accepted - seller (message)"
											: "Transaction not accepted - buyer (message)"
									}
									ui={{
										width: "full",
										text: "sm",
										opacity: "medium",
									}}
									className="text-center"
								/>
							);
						})
						.with("dispute", () => {
							return (
								<ChatInput
									onSubmit={(message) => {
										messageMutation.mutate(
											{
												transactionId,
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
										"Transaction - dispute - send a message (placeholder)",
									)}
									loading={messageMutation.isPending}
								/>
							);
						})
						.with("rejected", "expired", "success", "closed", () => {
							return (
								<Tx
									label={"Chat - transaction closed (message)"}
									ui={{
										width: "full",
										text: "sm",
										opacity: "medium",
									}}
									className="text-center"
								/>
							);
						})
						.exhaustive();
				}}
			</withTransactionFetchQuery.Suspense>
		</Container>
	);
};
