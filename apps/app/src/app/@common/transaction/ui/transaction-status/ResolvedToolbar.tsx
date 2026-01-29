import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { SuccessButton } from "~/app/@buyer-user/transaction-status/ui/button/SuccessButton";
import { CloseButton } from "~/app/@common/transaction/ui/button/CloseButton";
import { DisputeButton } from "~/app/@common/transaction/ui/button/DisputeButton";
import { TransactionButtonUi } from "~/app/@common/transaction/ui/transaction-status/TransactionButtonUi";
import { useSide } from "~/app/@user/user/useSide";

export namespace ResolvedToolbar {
	export interface Props {
		transaction: tTransaction;
	}
}

export const ResolvedToolbar: FC<ResolvedToolbar.Props> = ({ transaction }) => {
	const side = useSide();

	return (
		<>
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

			<DisputeButton
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</>
	);
};
