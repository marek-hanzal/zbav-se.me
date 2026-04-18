import type { FC } from "react";
import { useState } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Button } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import { CloseButton } from "~/common/ui/button";
import { EmailIcon } from "~/common/ui/icon";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { withTransactionEntryQuery } from "~/user/transaction-entry/query/withTransactionEntryQuery";
import { PersonalControl } from "./PersonalControl";

export namespace PersonalButton {
	export interface Props extends Button.Props {
		close?: TransactionMenuButton.Close;
		transactionId: string;
		onPostMutation?: () => Promise<void>;
	}
}

export const PersonalButton: FC<PersonalButton.Props> = ({
	close,
	transactionId,
	onPostMutation,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const mutation = withTransactionEntryQuery.useCreateMutation({
		invalidate: [
			"collection",
			"count",
		],
		async onPostMutation() {
			await onPostMutation?.();
			setIsOpen(false);
			close?.();
		},
	});

	return (
		<>
			<Button
				data-ui="PersonalButton"
				iconEnabled={EmailIcon}
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			>
				<Tx label="Share contact info (button)" />
			</Button>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				detent={"default"}
				withHeader
				header={({ close }) => ({
					title: "Share contact info (title)",
					right: <CloseButton onClick={close} />,
				})}
			>
				<PersonalControl
					onCancel={() => {
						setIsOpen(false);
					}}
					onSave={async (payload) => {
						return mutation.mutateAsync({
							transactionId,
							kind: "personal",
							payload,
						});
					}}
					data-ui-inner="default"
				/>
			</BottomSheet>
		</>
	);
};
