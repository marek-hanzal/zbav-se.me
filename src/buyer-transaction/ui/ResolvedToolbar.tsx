import type { FC } from "react";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { CloseButton } from "~/buyer-transaction/ui/CloseButton";
import { DisputeButton } from "~/buyer-transaction/ui/DisputeButton";
import { SuccessButton } from "~/buyer-transaction/ui/SuccessButton";
import { Group } from "~/ui/ui/Group";
import { TransactionButtonUi } from "~/user-transaction/ui/TransactionButtonUi";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace ResolvedToolbar {
	export interface Props {
		closeFn: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const ResolvedToolbar: FC<ResolvedToolbar.Props> = ({ closeFn, transaction }) => (
	<>
		<Group>
			<SuccessButton
				closeFn={closeFn}
				transaction={transaction}
				{...TransactionButtonUi}
			/>

			<CloseButton
				closeFn={closeFn}
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</Group>

		<Group>
			<DisputeButton
				closeFn={closeFn}
				transaction={transaction}
				{...TransactionButtonUi}
			/>
		</Group>
	</>
);
