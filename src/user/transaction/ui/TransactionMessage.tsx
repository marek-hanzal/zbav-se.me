import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import type { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";

export namespace TransactionMessage {
	export interface Props extends Container.Props {
		closed?: ReactNode;
		dispute?: ReactNode;
		expired?: ReactNode;
		trade?: ReactNode;
		interest?: ReactNode;
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
	trade,
	interest,
	rejected,
	resolved,
	sold,
	status,
	success,
	...props
}) => {
	const message = match(status)
		.with("interest", () => interest ?? null)
		.with("trade", () => trade ?? null)
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
			data-ui="TransactionMessage[Container]"
			data-ui-flow="vertical"
			data-ui-gap="default"
			{...props}
		>
			{message}
		</Container>
	) : null;
};
