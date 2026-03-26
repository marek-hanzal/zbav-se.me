import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { CloseButton } from "@zbav-se.me/ui/button";
import { EmailIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import { withTransactionEntryQuery } from "~/client/@common/transaction-entry/withTransactionEntryQuery";
import type { TransactionMenuButton } from "~/client/@user/transaction/ui/TransactionMenuButton";
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
					ui={{
						inner: "default",
					}}
				/>
			</BottomSheet>
		</>
	);
};
