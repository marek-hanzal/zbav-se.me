import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { SellerInfoButton } from "~/app/listing/ui/button/SellerInfoButton";
import { AcceptButton } from "~/app/transaction/ui/button/AcceptButton";
import { RejectButton } from "~/app/transaction/ui/button/RejectButton";
import { BuyerInfoButton } from "~/app/transaction/ui/buyer/BuyerInfoButton";
import { TransactionButtonUi } from "~/app/transaction/ui/transaction-status/TransactionButtonUi";
import { useSide } from "~/app/user/useSide";

export namespace PendingToolbar {
	export interface Props {
		transaction: tTransaction;
	}
}

export const PendingToolbar: FC<PendingToolbar.Props> = ({ transaction }) => {
	const side = useSide();

	return (
		<>
			{side === "buyer" ? (
				<SellerInfoButton
					listingId={transaction.listingId}
					{...TransactionButtonUi}
				/>
			) : null}

			{side === "seller" ? (
				<BuyerInfoButton
					transactionId={transaction.id}
					{...TransactionButtonUi}
				/>
			) : null}

			{side === "seller" ? (
				<AcceptButton
					transaction={transaction}
					{...TransactionButtonUi}
				/>
			) : null}

			<RejectButton
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</>
	);
};
