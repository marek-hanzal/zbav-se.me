import type { FC } from "react";
import { Group } from "@/lib/client/group";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import { AckButton } from "~/seller/transaction/ui/button/AckButton";
import { MessageButtonUi } from "~/user/transaction/ui/MessageButtonUi";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";

export namespace AckMessage {
	export interface Props extends Group.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const AckMessage: FC<AckMessage.Props> = ({ close, transaction, ...props }) => {
	return (
		<Group
			data-ui={"AckMessage"}
			ui={{
				round: "default",
				flow: "vertical",
				tone: "link",
				...ui,
			}}
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
