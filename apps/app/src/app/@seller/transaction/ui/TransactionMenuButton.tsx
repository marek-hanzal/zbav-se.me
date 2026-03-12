import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import { CloseButton } from "@zbav-se.me/ui/button";
import { PaperclipIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import { TransactionMenu } from "./TransactionMenu";

export namespace TransactionMenuButton {
	export interface Props extends Button.Props {
		transaction: tTransaction;
	}
}

export const TransactionMenuButton: FC<TransactionMenuButton.Props> = ({
	transaction,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				data-ui={"TransactionMenuButton[Button]"}
				iconEnabled={PaperclipIcon}
				onClick={() => {
					setIsOpen(true);
				}}
				ui={{
					tone: "link",
					theme: "light",
				}}
				{...props}
			/>

			<BottomSheet
				data-ui={"TransactionMenuButton[BottomSheet]"}
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				detent={"content"}
				header={({ close }) => ({
					title: translator.text("Transaction options (title)"),
					right: <CloseButton onClick={close} />,
				})}
			>
				<TransactionMenu transaction={transaction} />
			</BottomSheet>
		</>
	);
};
