import type { FC, ReactNode } from "react";
import { useCallback } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { Tx } from "@/lib/client/tx";
import { ChatInput } from "~/common/ui/chat";
import type { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { withTransactionEntryQuery } from "~/user/transaction-entry/query/withTransactionEntryQuery";

export namespace TransactionChat {
	export interface Hooks {
		onPostMutation?(): Promise<void>;
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
		async onPostMutation() {
			await hooks?.onPostMutation?.();
		},
	});

	const submit = useCallback(
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
							onSubmit={submit}
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
							onSubmit={submit}
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
							onSubmit={submit}
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
