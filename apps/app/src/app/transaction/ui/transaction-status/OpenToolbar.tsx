import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { PackageButton } from "~/app/transaction/ui/button/PackageButton";
import { RejectButton } from "~/app/transaction/ui/button/RejectButton";
import { TransactionButtonUi } from "~/app/transaction/ui/transaction-status/TransactionButtonUi";
import { useSide } from "~/app/user/useSide";

export namespace OpenToolbar {
	export interface Props {
		transaction: tTransaction;
	}
}

export const OpenToolbar: FC<OpenToolbar.Props> = ({ transaction }) => {
	const side = useSide();

	return (
		<>
			{side === "seller" ? (
				<PackageButton
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
