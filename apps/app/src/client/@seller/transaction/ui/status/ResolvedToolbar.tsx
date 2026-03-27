import { Group } from "@use-pico/client/ui/group";
import type { FC } from "react";
import { TransactionButtonUi } from "~/client/@user/transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/client/@user/transaction/ui/TransactionMenuButton";
import type { TransactionSchema } from "~/server/@seller/transaction/schema/TransactionSchema";
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
