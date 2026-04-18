import type { FC, ReactNode } from "react";
import { useState } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Button } from "@/lib/client/button";
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
					"data-ui-text": "xl",
				}}
				onClick={() => {
					setIsOpen(true);
				}}
				data-ui-tone="link"
				data-ui-theme="light"
				data-ui-square="sm"
				data-ui-justify="center"
				data-ui-items="center"
				data-ui-border={false}
				data-ui-shadow={false}
				data-ui-background={undefined}
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
