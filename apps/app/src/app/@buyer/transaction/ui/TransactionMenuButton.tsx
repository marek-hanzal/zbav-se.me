import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
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
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				onClick={() => {
					setIsOpen(true);
				}}
				ui={{
					tone: "link",
					theme: "light",
					square: "sm",
					justify: "center",
					items: "center",
					border: false,
					shadow: false,
					background: undefined,
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
			>
				<TransactionMenu transaction={transaction} />
			</BottomSheet>
		</>
	);
};
