import type { FC } from "react";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { DisputeMessage } from "~/buyer-transaction/ui/DisputeMessage";
import { DisputeToolbar } from "~/buyer-transaction/ui/DisputeToolbar";
import { InterestMessage } from "~/buyer-transaction/ui/InterestMessage";
import { ResolvedToolbar } from "~/buyer-transaction/ui/ResolvedToolbar";
import { TradeMessage } from "~/buyer-transaction/ui/TradeMessage";
import { TradeToolbar } from "~/buyer-transaction/ui/TradeToolbar";
import { Container } from "~/ui/ui/Container";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";
import { TransactionMessage } from "~/user-transaction/ui/TransactionMessage";
import { TransactionToolbar } from "~/user-transaction/ui/TransactionToolbar";

export namespace TransactionMenu {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const TransactionMenu: FC<TransactionMenu.Props> = ({ close, transaction, ...props }) => {
	return (
		<Container
			data-ui={"TransactionMenu"}
			data-transaction={transaction.status}
			data-ui-flow="vertical"
			data-ui-gap="md"
			data-ui-width="full"
			data-ui-inner="default"
			{...props}
		>
			<TransactionMessage
				status={transaction.status}
				interest={
					<InterestMessage
						close={close}
						transaction={transaction}
					/>
				}
				trade={
					<TradeMessage
						close={close}
						transaction={transaction}
					/>
				}
				dispute={
					<DisputeMessage
						close={close}
						transaction={transaction}
					/>
				}
			/>

			<TransactionToolbar
				status={transaction.status}
				trade={
					<TradeToolbar
						close={close}
						transaction={transaction}
					/>
				}
				resolved={
					<ResolvedToolbar
						close={close}
						transaction={transaction}
					/>
				}
				dispute={
					<DisputeToolbar
						close={close}
						transaction={transaction}
					/>
				}
			/>
		</Container>
	);
};
