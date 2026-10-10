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
		closeFn?: TransactionMenuButton.Close;
		transactionId: string;
		onPostMutationFn?: () => Promise<void>;
	}
}

export const PersonalButton: FC<PersonalButton.Props> = ({
	closeFn,
	transactionId,
	onPostMutationFn,
	...props
}) => {
	const translator = useTranslator();
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
				data-ui="PersonalButton"
				iconEnabled={"icon-[solar--card-2-linear]"}
				onClick={() => {
					setIsOpenFn(true);
				}}
				{...props}
			>
				<Tx label="Share contact info (button)" />
			</Button>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => {
					setIsOpenFn(false);
				}}
				detent={"default"}
				withHeader
				headerFn={({ closeFn }) => ({
					title: translator.textFn("Share contact info (title)"),
					right: <CloseButton onClick={closeFn} />,
				})}
			>
				<PersonalControl
					onCancelFn={() => {
						setIsOpenFn(false);
					}}
					onSaveFn={async (payload) => {
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
