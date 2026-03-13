import type { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import type { tTransaction as tBuyerTransaction } from "@zbav-se.me/sdk/api/buyer";
import type { tTransaction as tSellerTransaction } from "@zbav-se.me/sdk/api/seller";
import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";

export namespace TransactionToolbar {
	type Status = tBuyerTransaction["status"] | tSellerTransaction["status"];

	export interface Props extends Container.Props {
		dispute?: ReactNode;
		open?: ReactNode;
		resolved?: ReactNode;
		status: Status;
	}
}

export const TransactionToolbar: FC<TransactionToolbar.Props> = ({
	dispute,
	open,
	resolved,
	status,
	ui,
	...props
}) => {
	const toolbar = match(status)
		.with("open", () => open ?? null)
		.with("resolved", () => resolved ?? null)
		.with("dispute", () => dispute ?? null)
		.with("pending", "rejected", "sold", "expired", "success", "closed", () => null)
		.exhaustive();

	return toolbar ? (
		<Group
			data-ui={"TransactionToolbar[Group]"}
			ui={{
				flow: "vertical",
				opacity: "8",
				justify: "center",
				items: "center",
				width: "full",
				...ui,
			}}
			{...props}
		>
			{toolbar}
		</Group>
	) : null;
};
