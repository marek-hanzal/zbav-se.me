import type { FC, ReactNode } from "react";
import { useState } from "react";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { Button } from "~/ui/ui/Button";

export namespace TransactionMenuButton {
	export type Close = () => void;

	export interface Props extends Omit<Button.Props, "children"> {
		children(closeFn: Close): ReactNode;
	}
}

export const TransactionMenuButton: FC<TransactionMenuButton.Props> = ({
	children: childrenFn,
	...props
}) => {
	const [isOpen, setIsOpenFn] = useState(false);
	const closeFn = () => {
		setIsOpenFn(false);
	};

	return (
		<>
			<Button
				data-ui={"TransactionMenuButton"}
				iconEnabled={"icon-[solar--paperclip-linear]"}
				iconProps={{
					"data-ui-text": "xl",
				}}
				onClick={() => {
					setIsOpenFn(true);
				}}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-square="sm"
				data-ui-justify="center"
				data-ui-items="center"
				data-ui-color={"lead"}
				data-ui-border={false}
				data-ui-shadow={false}
				data-ui-background={undefined}
				{...props}
			/>

			<BottomSheet
				data-ui={"TransactionMenuButton[BottomSheet]"}
				isOpen={isOpen}
				onClose={closeFn}
				detent={"content"}
			>
				{childrenFn(closeFn)}
			</BottomSheet>
		</>
	);
};
