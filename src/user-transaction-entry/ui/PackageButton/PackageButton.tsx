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
		closeFn?: TransactionMenuButton.Close;
		transactionId: string;
		onPostMutationFn?(): Promise<void>;
	}
}

export const PackageButton: FC<PackageButton.Props> = ({
	closeFn,
	transactionId,
	onPostMutationFn,
	...props
}) => {
	const [isOpen, setIsOpenFn] = useState(false);
	const mutation = withTransactionEntryQuery.useCreateMutation({
		invalidate: [
			"collection",
			"count",
		],
		async onPostMutationFn() {
			await onPostMutationFn?.();
			setIsOpenFn(false);
			closeFn?.();
		},
	});

	return (
		<>
			<Button
				data-ui="PackageButton[Button]"
				iconEnabled={SendPackageIcon}
				onClick={() => {
					setIsOpenFn(true);
				}}
				{...props}
			>
				<Tx label="Share package (button)" />
			</Button>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => {
					setIsOpenFn(false);
				}}
				detent={"full"}
				withHeader
				headerFn={() => ({
					title: "Share package (title)",
				})}
			>
				<PackageControl
					data-ui="PackageButton[PackageControl]"
					onCancelFn={() => {
						setIsOpenFn(false);
					}}
					onSaveFn={async (payload) => {
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
