import type { FC } from "react";
import { Container } from "@/lib/client/container";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { TransactionMessage } from "~/user/transaction/ui/TransactionMessage";
import { TransactionToolbar } from "~/user/transaction/ui/TransactionToolbar";
import { DisputeMessage } from "./status/DisputeMessage";
import { DisputeToolbar } from "./status/DisputeToolbar";
import { InterestMessage } from "./status/InterestMessage";
import { ResolvedToolbar } from "./status/ResolvedToolbar";
import { TradeMessage } from "./status/TradeMessage";
import { TradeToolbar } from "./status/TradeToolbar";

export namespace TransactionMenu {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const TransactionMenu: FC<TransactionMenu.Props> = ({ close, transaction, ...props }) => {
	return (
		<Container
			data-ui={"TransactionMenu[Container]"}
			data-transaction={transaction.status}
			ui={{
				flow: "vertical",
				gap: "md",
				width: "full",
				inner: "default",
				...ui,
			}}
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
