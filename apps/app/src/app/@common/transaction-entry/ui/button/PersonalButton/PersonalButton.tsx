import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import { CloseButton } from "@zbav-se.me/ui/button";
import { EmailIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { PersonalControl } from "./PersonalControl";

export namespace PersonalButton {
	export interface Props extends Button.Props {
		close?: TransactionMenuButton.Close;
		transactionId: string;
	}
}

export const PersonalButton: FC<PersonalButton.Props> = ({ close, transactionId, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const mutation = withTransactionEntryQuery.useCreateMutation({
		invalidate: [
			"collection",
			"count",
		],
		async onPostMutation() {
			setIsOpen(false);
			close?.();
		},
	});

	return (
		<>
			<Button
				data-ui="PersonalButton[Button]"
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
					data-ui="PersonalButton[PersonalControl]"
					onCancel={() => {
						setIsOpen(false);
					}}
					onSave={(payload) => {
						return mutation.mutateAsync({
							transactionId,
							kind: "personal",
							payload,
						});
					}}
					loading={mutation.isPending}
					ui={{
						inner: "default",
					}}
				/>
			</BottomSheet>
		</>
	);
};
