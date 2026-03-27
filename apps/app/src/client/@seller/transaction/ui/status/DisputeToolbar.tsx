import { Group } from "@use-pico/client/ui/group";
import type { FC } from "react";
import type { TransactionSchema } from "~/client/@seller/transaction/server/schema/TransactionSchema";
import { TransactionButtonUi } from "~/client/@user/transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/client/@user/transaction/ui/TransactionMenuButton";
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
