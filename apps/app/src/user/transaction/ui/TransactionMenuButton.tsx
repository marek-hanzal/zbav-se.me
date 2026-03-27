import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import { PaperclipIcon } from "~/common/ui/icon";

export namespace TransactionMenuButton {
	export type Close = () => void;

	export interface Props extends Omit<Button.Props, "children"> {
		children(close: Close): ReactNode;
	}
}

export const TransactionMenuButton: FC<TransactionMenuButton.Props> = ({ children, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const close = () => {
		setIsOpen(false);
	};

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
				onClose={close}
				detent={"content"}
			>
				{children(close)}
			</BottomSheet>
		</>
	);
};
