import { Container } from "@use-pico/client/ui/container";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { FC } from "react";
import { TransactionMessage } from "./TransactionMessage";
import { TransactionToolbar } from "./TransactionToolbar";

export namespace TransactionMenu {
	export interface Props extends Container.Props {
		transaction: tTransaction;
	}
}

export const TransactionMenu: FC<TransactionMenu.Props> = ({ transaction, ui, ...props }) => {
	return (
		<Container
			data-ui={"TransactionMenu[Container]"}
			ui={{
				flow: "vertical",
				gap: "md",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<TransactionMessage transaction={transaction} />

			<TransactionToolbar transaction={transaction} />
		</Container>
	);
};
