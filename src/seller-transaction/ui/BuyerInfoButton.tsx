import { type FC, Suspense, useState } from "react";
import { BuyerIcon } from "~/application-ui/constant/icon.exports";
import { CloseButton } from "~/application-ui/ui/button.exports";
import { BuyerInfo } from "~/seller-transaction/ui/BuyerInfo/index";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { Button } from "~/ui/ui/Button";

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
	const translator = useTranslator();
	const [isOpen, setIsOpenFn] = useState(false);

	return (
		<>
			<Button
				data-ui="BuyerInfoButton[Button]"
				iconEnabled={BuyerIcon}
				onClick={() => {
					setIsOpenFn(true);
				}}
				{...props}
			>
				<Tx label="Buyer info (button)" />
			</Button>

			<BottomSheet
				data-ui="BuyerInfoButton[BottomSheet]"
				isOpen={isOpen}
				onClose={() => {
					setIsOpenFn(false);
				}}
				headerFn={({ closeFn }) => ({
					title: translator.textFn("Buyer info (title)"),
					right: <CloseButton onClick={closeFn} />,
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
