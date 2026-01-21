import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { translator } from "@use-pico/common/translator";
import { CloseButton } from "@zbav-se.me/ui/button";
import type { FC } from "react";
import { Transaction } from "~/app/transaction/ui/seller/Transaction";

export namespace TransactionSheet {
	export interface Props extends BottomSheet.Props {
		transactionId: string;
		refresh: number;
	}
}

export const TransactionSheet: FC<TransactionSheet.Props> = ({
	transactionId,
	refresh,
	...props
}) => {
	return (
		<BottomSheet
			data-ui={"TransactionSheet-[SheetView]"}
			data-id={transactionId}
			header={({ close }) => ({
				title: translator.text("Messages (title)"),
				right: <CloseButton onClick={close} />,
			})}
			contentProps={{
				disableScroll: true,
			}}
			detent={"full"}
			{...props}
		>
			<Transaction
				transactionId={transactionId}
				refresh={refresh}
			/>
		</BottomSheet>
	);
};
