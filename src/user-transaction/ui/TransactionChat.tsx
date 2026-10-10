import type { FC, ReactNode } from "react";
import { useCallback } from "react";
import { match } from "ts-pattern";
import { ChatInput } from "~/application-ui/ui/chat.exports";
import type { TransactionStatusEnumSchema } from "~/transaction-contract/schema/TransactionStatusEnumSchema";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { withTransactionEntryQuery } from "~/user-transaction-entry/query/withTransactionEntryQuery";

export namespace TransactionChat {
	export interface Hooks {
		onPostMutationFn?(): Promise<void>;
	}

	export interface Text {
		closed: string;
		dispute: string;
		open: string;
		pending: string;
		resolved: string;
	}

	export interface Transaction {
		id: string;
		status: TransactionStatusEnumSchema.Type;
	}

	export interface Props extends Container.Props {
		hooks?: Hooks;
		left?: ReactNode;
		text: Text;
		transaction: Transaction;
	}
}

export const TransactionChat: FC<TransactionChat.Props> = ({
	hooks,
	left,
	text,
	transaction,
	...props
}) => {
	const messageMutation = withTransactionEntryQuery.useCreateMutation({
		invalidate: [
			"collection",
			"count",
		],
		async onPostMutationFn() {
			await hooks?.onPostMutationFn?.();
		},
	});

	const submitFn = useCallback(
		async (message: string) => {
			await messageMutation.mutateAsync({
				transactionId: transaction.id,
				kind: "text",
				payload: {
					text: message,
				},
			});
		},
		[
			messageMutation,
			transaction.id,
		],
	);

	return (
		<Container
			data-ui="TransactionChat"
			data-ui-layout="vertical-flex"
			data-ui-width="full"
			data-ui-snap-to={"bottom-center"}
			{...props}
		>
			{match(transaction.status)
				.with("interest", () => {
					return (
						<ChatInput
							onSubmitFn={submitFn}
							placeholder={text.pending}
							loading={messageMutation.isPending}
							disableInput={messageMutation.isPending}
							disableSubmit={messageMutation.isPending}
							left={left}
						/>
					);
				})
				.with("trade", () => {
					return (
						<ChatInput
							onSubmitFn={submitFn}
							placeholder={text.open}
							loading={messageMutation.isPending}
							disableInput={messageMutation.isPending}
							disableSubmit={messageMutation.isPending}
							left={left}
						/>
					);
				})
				.with("resolved", () => {
					return (
						<Container
							data-ui-layout="horizontal-flex"
							data-ui-items="center"
							data-ui-gap="md"
							data-ui-width="full"
						>
							{left}

							<Tx
								label={text.resolved}
								data-ui-width="full"
								data-ui-text="sm"
								data-ui-opacity="6"
								className="text-center"
							/>
						</Container>
					);
				})
				.with("dispute", () => {
					return (
						<ChatInput
							onSubmitFn={submitFn}
							placeholder={text.dispute}
							loading={messageMutation.isPending}
							disableInput={messageMutation.isPending}
							disableSubmit={messageMutation.isPending}
							left={left}
						/>
					);
				})
				.with("rejected", "sold", "expired", "success", "closed", () => {
					return (
						<Tx
							label={text.closed}
							data-ui-width="full"
							data-ui-text="sm"
							data-ui-opacity="6"
							className="text-center"
						/>
					);
				})
				.exhaustive()}
		</Container>
	);
};
