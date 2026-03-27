import { Group } from "@use-pico/client/ui/group";
import type { FC } from "react";
import type { TransactionSchema } from "~/client/@seller/transaction/server/schema/TransactionSchema";
import { TransactionButtonUi } from "~/client/@user/transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/client/@user/transaction/ui/TransactionMenuButton";
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
