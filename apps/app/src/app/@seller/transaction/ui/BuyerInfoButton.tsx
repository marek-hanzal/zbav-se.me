import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { CloseButton } from "@zbav-se.me/ui/button";
import { BuyerIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { BuyerInfo } from "./BuyerInfo";

export namespace BuyerInfoButton {
	export interface Props extends Button.Props {
		transactionId: string;
	}
}

/**
 * Renders an action button that opens buyer information in a bottom sheet for a selected transaction.
 * Use it in transaction toolbars where sellers need quick access to buyer details without route changes.
 *
 * @see apps/app/src/app//transaction/ui/BuyerInfo/BuyerInfo.tsx
 */
export const BuyerInfoButton: FC<BuyerInfoButton.Props> = ({ transactionId, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				data-ui="BuyerInfoButton[Button]"
				iconEnabled={BuyerIcon}
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			>
				<Tx label="Buyer info (button)" />
			</Button>

			<BottomSheet
				data-ui="BuyerInfoButton[BottomSheet]"
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				header={({ close }) => ({
					title: translator.text("Buyer info (title)"),
					right: <CloseButton onClick={close} />,
				})}
			>
				<BuyerInfo
					transactionId={transactionId}
					ui={{
						inner: "default",
					}}
				/>
			</BottomSheet>
		</>
	);
};
