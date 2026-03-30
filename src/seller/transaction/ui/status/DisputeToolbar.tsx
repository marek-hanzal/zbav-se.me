import type { FC } from "react";
import { Group } from "@/lib/client/group";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { TransactionButtonUi } from "~/user/transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { ResolveButton } from "../button/ResolveButton";

export namespace DisputeToolbar {
	export interface Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const DisputeToolbar: FC<DisputeToolbar.Props> = ({ close, transaction }) => {
	return (
		<Group>
			<ResolveButton
				close={close}
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</Group>
	);
};
