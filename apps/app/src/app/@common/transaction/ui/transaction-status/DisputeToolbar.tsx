import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { SuccessButton } from "~/app/@buyer-user/transaction-status/ui/button/SuccessButton";
import { CloseButton } from "~/app/@common/transaction/ui/button/CloseButton";
import { TransactionButtonUi } from "~/app/@common/transaction/ui/transaction-status/TransactionButtonUi";
import { ResolveButton } from "~/app/@seller-user/transaction-status/ui/button/ResolveButton";
import { useSide } from "~/app/@user/user/useSide";

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
