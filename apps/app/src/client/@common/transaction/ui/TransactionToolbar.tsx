import { Container } from "@use-pico/client/ui/container";
import type { tTransaction as tBuyerTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { tTransaction as tSellerTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";

export namespace TransactionToolbar {
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

export const TransactionToolbar: FC<TransactionToolbar.Props> = ({
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
	const toolbar = match(status)
		.with("open", () => open ?? null)
		.with("resolved", () => resolved ?? null)
		.with("dispute", () => dispute ?? null)
		.with("pending", () => pending ?? null)
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
