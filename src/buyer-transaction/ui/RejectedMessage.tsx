import type { FC } from "react";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { AckButton } from "~/buyer-transaction/ui/AckButton";
import type { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { MessageButtonUi } from "~/user-transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace RejectedMessage {
	export interface Props extends Container.Props {
		closeFn: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const RejectedMessage: FC<RejectedMessage.Props> = ({ closeFn, transaction, ...props }) => {
	return (
		<Group
			data-ui={"RejectedMessage"}
			data-ui-round="default"
			data-ui-flow="vertical"
			data-ui-tone="primary"
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
