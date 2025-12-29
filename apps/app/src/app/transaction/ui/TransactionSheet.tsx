import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import type { FC } from "react";
import { Transaction } from "~/app/transaction/ui/Transaction";

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
