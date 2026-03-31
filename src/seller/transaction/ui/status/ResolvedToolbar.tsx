import type { FC } from "react";
import { Group } from "@/lib/client/group";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { TransactionButtonUi } from "~/user/transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { DisputeButton } from "../button/DisputeButton";

export namespace ResolvedToolbar {
	export interface Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const ResolvedToolbar: FC<ResolvedToolbar.Props> = ({ close, transaction }) => (
	<Group>
		<DisputeButton
			close={close}
			transaction={transaction}
			{...TransactionButtonUi}
		/>
	</Group>
);
