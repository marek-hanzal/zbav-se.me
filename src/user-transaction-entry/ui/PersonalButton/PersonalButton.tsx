import type { FC } from "react";
import { useState } from "react";
import { CloseButton } from "~/application-ui/ui/button.exports";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { Button } from "~/ui/ui/Button";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";
import { withTransactionEntryQuery } from "~/user-transaction-entry/query/withTransactionEntryQuery";
import { PersonalControl } from "~/user-transaction-entry/ui/PersonalButton/PersonalControl";

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
	const translator = useTranslator();
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
				iconEnabled={"icon-[solar--card-2-linear]"}
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
					title: translator.text("Share contact info (title)"),
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
				/>
			</BottomSheet>
		</>
	);
};
