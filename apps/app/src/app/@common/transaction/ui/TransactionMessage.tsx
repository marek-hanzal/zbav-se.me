import { Container } from "@use-pico/client/ui/container";
import type { tTransaction as tBuyerTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { tTransaction as tSellerTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";

export namespace TransactionMessage {
	type Status = tBuyerTransaction["status"] | tSellerTransaction["status"];

	export interface Props extends Container.Props {
		dispute?: ReactNode;
		open?: ReactNode;
		pending?: ReactNode;
		status: Status;
	}
}

export const TransactionMessage: FC<TransactionMessage.Props> = ({
	dispute,
	open,
	pending,
	status,
	ui,
	...props
}) => {
	const message = match(status)
		.with("pending", () => pending ?? null)
		.with("open", () => open ?? null)
		.with("dispute", () => dispute ?? null)
		.with("rejected", "resolved", "sold", "expired", "success", "closed", () => null)
		.exhaustive();

	return message ? (
		<Container
			data-ui={"TransactionMessage[Container]"}
			ui={{
				flow: "vertical",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			{message}
		</Container>
	) : null;
};
