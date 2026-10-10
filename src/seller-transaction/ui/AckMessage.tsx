import type { FC } from "react";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { AckButton } from "~/seller-transaction/ui/AckButton";
import { Group } from "~/ui/ui/Group";
import { MessageButtonUi } from "~/user-transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace AckMessage {
	export interface Props extends Group.Props {
		closeFn: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const AckMessage: FC<AckMessage.Props> = ({ closeFn, transaction, ...props }) => {
	return (
		<Group
			data-ui={"AckMessage"}
			data-ui-round="default"
			data-ui-flow="vertical"
			data-ui-tone="link"
			{...props}
		>
			<AckButton
				closeFn={closeFn}
				transaction={transaction}
				{...MessageButtonUi}
			/>
		</Group>
	);
};
