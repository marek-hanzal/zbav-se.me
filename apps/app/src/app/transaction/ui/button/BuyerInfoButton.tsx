import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import type { tTransactionLog } from "@zbav-se.me/sdk/api/user";
import { BuyerIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { BuyerInfoContainer } from "../BuyerInfoContainer";

export namespace BuyerInfoButton {
	export interface Props extends Button.Props {
		locale: string;
		log: tTransactionLog;
		modalRootId?: string;
	}
}

export const BuyerInfoButton: FC<BuyerInfoButton.Props> = ({
	locale,
	log,
	modalRootId,
	ui,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				iconEnabled={BuyerIcon}
				label={"Buyer info (label)"}
				onClick={() => setIsOpen(true)}
				ui={{
					tone: "primary",
					theme: "light",
					size: "xl",
					justify: "start",
					...ui,
				}}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"default"}
				modalEffectRootId={modalRootId}
				header={{
					close: true,
					title: "Buyer info (title)",
				}}
			>
				<BuyerInfoContainer
					locale={locale}
					transactionId={log.transactionId}
				/>
			</BottomSheet>
		</>
	);
};
