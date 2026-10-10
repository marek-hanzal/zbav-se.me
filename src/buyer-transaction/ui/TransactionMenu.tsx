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
		closeFn: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const TransactionMenu: FC<TransactionMenu.Props> = ({ closeFn, transaction, ...props }) => {
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
						closeFn={closeFn}
						transaction={transaction}
					/>
				}
				trade={
					<TradeMessage
						closeFn={closeFn}
						transaction={transaction}
					/>
				}
				dispute={
					<DisputeMessage
						closeFn={closeFn}
						transaction={transaction}
					/>
				}
			/>

			<TransactionToolbar
				status={transaction.status}
				trade={
					<TradeToolbar
						closeFn={closeFn}
						transaction={transaction}
					/>
				}
				resolved={
					<ResolvedToolbar
						closeFn={closeFn}
						transaction={transaction}
					/>
				}
				dispute={
					<DisputeToolbar
						closeFn={closeFn}
						transaction={transaction}
					/>
				}
			/>
		</Container>
	);
};
