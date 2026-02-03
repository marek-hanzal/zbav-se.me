import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { useSide } from "~/app/@user/useSide";
import { CloseButton } from "~/app/transaction/ui/button/CloseButton";
import { ResolveButton } from "~/app/transaction/ui/button/ResolveButton";
import { SuccessButton } from "~/app/transaction/ui/button/SuccessButton";
import { TransactionButtonUi } from "~/app/transaction/ui/transaction-status/TransactionButtonUi";

export namespace DisputeToolbar {
	export interface Props {
		transaction: tTransaction;
	}
}

export const DisputeToolbar: FC<DisputeToolbar.Props> = ({ transaction }) => {
	const side = useSide();

	return (
		<>
			{side === "seller" ? (
				<ResolveButton
					transaction={transaction}
					{...TransactionButtonUi}
				/>
			) : null}

			{side === "buyer" ? (
				<SuccessButton
					transaction={transaction}
					{...TransactionButtonUi}
				/>
			) : null}

			{side === "buyer" ? (
				<CloseButton
					transaction={transaction}
					{...TransactionButtonUi}
				/>
			) : null}
		</>
	);
};
