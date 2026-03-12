import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { TransactionMessage } from "./TransactionMessage";
import { TransactionToolbar } from "./TransactionToolbar";

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
				close={close}
				transaction={transaction}
			/>

			<TransactionToolbar
				close={close}
				transaction={transaction}
			/>
		</Container>
	);
};
