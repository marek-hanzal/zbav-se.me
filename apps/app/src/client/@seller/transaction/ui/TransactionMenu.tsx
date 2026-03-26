import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import type { TransactionMenuButton } from "~/client/@user/transaction/ui/TransactionMenuButton";
import { TransactionMessage } from "~/client/@user/transaction/ui/TransactionMessage";
import { TransactionToolbar } from "~/client/@user/transaction/ui/TransactionToolbar";
import { DisputeMessage } from "./status/DisputeMessage";
import { DisputeToolbar } from "./status/DisputeToolbar";
import { OpenMessage } from "./status/OpenMessage";
import { OpenToolbar } from "./status/OpenToolbar";
import { PendingMessage } from "./status/PendingMessage";
import { ResolvedToolbar } from "./status/ResolvedToolbar";

export namespace TransactionMenu {
	export interface Props extends Container.Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const TransactionMenu: FC<TransactionMenu.Props> = ({
	close,
	transaction,
	ui,
	...props
}) => {
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
				pending={
					<PendingMessage
						close={close}
						transaction={transaction}
					/>
				}
				open={
					<OpenMessage
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
				open={
					<OpenToolbar
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
