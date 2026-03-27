import { Container } from "@use-pico/client/ui/container";
import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";
import type { TransactionStatusEnumSchema } from "~/@common/user-transaction/enum/TransactionStatusEnumSchema";

export namespace TransactionMessage {
	export interface Props extends Container.Props {
		closed?: ReactNode;
		dispute?: ReactNode;
		expired?: ReactNode;
		open?: ReactNode;
		pending?: ReactNode;
		rejected?: ReactNode;
		resolved?: ReactNode;
		sold?: ReactNode;
		status: TransactionStatusEnumSchema.Type;
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
