import { type FC, Suspense, useState } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Button } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { CloseButton } from "~/common/ui/button";
import { BuyerIcon } from "~/common/ui/icon";
import { BuyerInfo } from "../BuyerInfo";

export namespace BuyerInfoButton {
	export interface Props extends Button.Props {
		transactionId: string;
	}
}

/**
 * Renders an action button that opens buyer information in a bottom sheet for a selected transaction.
 * Use it in transaction toolbars where sellers need quick access to buyer details without route changes.
 *
 * @see src/transaction/ui/BuyerInfo/BuyerInfo.tsx
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
				detent={"default"}
			>
				<Suspense fallback={<BuyerInfo.Fallback />}>
					<BuyerInfo
						_suspense={"I know"}
						transactionId={transactionId}
						data-ui-inner="default"
					/>
				</Suspense>
			</BottomSheet>
		</>
	);
};
