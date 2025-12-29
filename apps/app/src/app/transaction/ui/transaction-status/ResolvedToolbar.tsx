import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { SuccessButton } from "~/app/transaction/ui/button/SuccessButton";
import { TransactionButtonUi } from "~/app/transaction/ui/transaction-status/TransactionButtonUi";
import { useSide } from "~/app/user/useSide";

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
		</>
	);
};
