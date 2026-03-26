import { Container } from "@use-pico/client/ui/container";
import type { tTransaction as tBuyerTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { tTransaction as tSellerTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";

export namespace TransactionMessage {
	type Status = tBuyerTransaction["status"] | tSellerTransaction["status"];

	export interface Props extends Container.Props {
		closed?: ReactNode;
		dispute?: ReactNode;
		expired?: ReactNode;
		open?: ReactNode;
		pending?: ReactNode;
		rejected?: ReactNode;
		resolved?: ReactNode;
		sold?: ReactNode;
		status: Status;
		success?: ReactNode;
	}
}

export const TransactionMessage: FC<TransactionMessage.Props> = ({
	closed,
	dispute,
	expired,
	open,
	pending,
	rejected,
	resolved,
	sold,
	status,
	success,
	ui,
	...props
}) => {
	const message = match(status)
		.with("pending", () => pending ?? null)
		.with("open", () => open ?? null)
		.with("dispute", () => dispute ?? null)
		.with("rejected", () => rejected ?? null)
		.with("resolved", () => resolved ?? null)
		.with("sold", () => sold ?? null)
		.with("expired", () => expired ?? null)
		.with("success", () => success ?? null)
		.with("closed", () => closed ?? null)
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
