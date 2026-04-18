import type { FC } from "react";
import type { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { AckButton } from "~/buyer/transaction/ui/button/AckButton";
import { MessageButtonUi } from "~/user/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";

export namespace RejectedMessage {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const RejectedMessage: FC<RejectedMessage.Props> = ({ close, transaction, ...props }) => {
	return (
		<Group
			data-ui={"RejectedMessage"}
			data-ui-round="default"
			data-ui-flow="vertical"
			data-ui-tone="primary"
			{...props}
		>
			<AckButton
				close={close}
				transaction={transaction}
				{...MessageButtonUi}
			/>
		</Group>
	);
};
