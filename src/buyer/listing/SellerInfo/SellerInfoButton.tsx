import { type FC, Suspense, useState } from "react";
import { CloseButton } from "~/common/ui/button";
import { SellerIcon } from "~/common/ui/icon";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { Button } from "~/ui/ui/Button";
import { SellerInfo } from "./SellerInfo";

export namespace SellerInfoButton {
	export interface Props extends Button.Props {
		listingId: string;
	}
}

/**
 * Renders an action button that opens seller information in a bottom sheet tied to a specific listing.
 * Use it in listing cards or detail headers where buyer users need quick access to seller details.
 *
 * @see src/listing/ui/SellerInfo/SellerInfo.tsx
 */
export const SellerInfoButton: FC<SellerInfoButton.Props> = ({ listingId, ...props }) => {
	const translator = useTranslator();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				data-ui="SellerInfoButton[Button]"
				iconEnabled={SellerIcon}
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			>
				<Tx label="Seller info (button)" />
			</Button>

			<BottomSheet
				data-ui="SellerInfoButton[BottomSheet]"
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				header={({ close }) => ({
					title: translator.text("Seller info (title)"),
					right: <CloseButton onClick={close} />,
				})}
				detent={"default"}
			>
				<Suspense fallback={<SellerInfo.Fallback />}>
					<SellerInfo
						_suspense={"I know"}
						listingId={listingId}
						data-ui-inner="default"
					/>
				</Suspense>
			</BottomSheet>
		</>
	);
};
