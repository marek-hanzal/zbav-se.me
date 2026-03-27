import { Group } from "@use-pico/client/ui/group";
import type { FC } from "react";
import { TransactionButtonUi } from "~/client/@user/transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/client/@user/transaction/ui/TransactionMenuButton";
import type { TransactionSchema } from "~/server/@buyer/transaction/schema/TransactionSchema";
import { CloseButton } from "../button/CloseButton";
import { SuccessButton } from "../button/SuccessButton";

export namespace OpenToolbar {
	export interface Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const OpenToolbar: FC<OpenToolbar.Props> = ({ close, transaction }) => {
	return (
		<Group>
			<SuccessButton
				close={close}
				transaction={transaction}
				{...TransactionButtonUi}
			/>

			<CloseButton
				close={close}
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</Group>
	);
};
