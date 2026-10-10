import type { FC } from "react";
import { useState } from "react";
import { SendPackageIcon } from "~/application-ui/constant/icon.exports";
import { Tx } from "~/translation/ui/Tx";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { Button } from "~/ui/ui/Button";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";
import { withTransactionEntryQuery } from "~/user-transaction-entry/query/withTransactionEntryQuery";
import { PackageControl } from "~/user-transaction-entry/ui/PackageButton/PackageControl";

export namespace PackageButton {
	export interface Props extends Button.Props {
		close?: TransactionMenuButton.Close;
		transactionId: string;
		onPostMutation?(): Promise<void>;
	}
}

export const PackageButton: FC<PackageButton.Props> = ({
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
				data-ui="PackageButton[Button]"
				iconEnabled={SendPackageIcon}
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			>
				<Tx label="Share package (button)" />
			</Button>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				detent={"full"}
				withHeader
				header={() => ({
					title: "Share package (title)",
				})}
			>
				<PackageControl
					data-ui="PackageButton[PackageControl]"
					onCancel={() => {
						setIsOpen(false);
					}}
					onSave={async (payload) => {
						return mutation.mutateAsync({
							transactionId,
							kind: "package",
							payload,
						});
					}}
					data-ui-inner="default"
				/>
			</BottomSheet>
		</>
	);
};
