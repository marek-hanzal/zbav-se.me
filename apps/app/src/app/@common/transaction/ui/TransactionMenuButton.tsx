import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { PaperclipIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";

export namespace TransactionMenuButton {
	export interface Props extends Button.Props {
		//
	}
}

export const TransactionMenuButton: FC<TransactionMenuButton.Props> = ({ children, ...props }) => {
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
				{children}
			</BottomSheet>
		</>
	);
};
