import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import type { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";

export namespace TransactionToolbar {
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

export const TransactionToolbar: FC<TransactionToolbar.Props> = ({
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
	ui,
	...props
}) => {
	const toolbar = match(status)
		.with("trade", () => trade ?? null)
		.with("resolved", () => resolved ?? null)
		.with("dispute", () => dispute ?? null)
		.with("interest", () => interest ?? null)
		.with("rejected", () => rejected ?? null)
		.with("sold", () => sold ?? null)
		.with("expired", () => expired ?? null)
		.with("success", () => success ?? null)
		.with("closed", () => closed ?? null)
		.exhaustive();

	return toolbar ? (
		<Container
			data-ui={"TransactionToolbar[Group]"}
			ui={{
				flow: "vertical",
				opacity: "8",
				justify: "center",
				items: "center",
				width: "full",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			{toolbar}
		</Container>
	) : null;
};
