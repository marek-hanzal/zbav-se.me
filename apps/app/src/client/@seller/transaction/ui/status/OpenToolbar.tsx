import { Group } from "@use-pico/client/ui/group";
import type { FC } from "react";
import { TransactionButtonUi } from "~/client/@user/transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/client/@user/transaction/ui/TransactionMenuButton";
import type { TransactionSchema } from "~/server/@seller/transaction/schema/TransactionSchema";
import { ResolveButton } from "../button/ResolveButton";

export namespace OpenToolbar {
	export interface Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const OpenToolbar: FC<OpenToolbar.Props> = ({ close, transaction }) => {
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
