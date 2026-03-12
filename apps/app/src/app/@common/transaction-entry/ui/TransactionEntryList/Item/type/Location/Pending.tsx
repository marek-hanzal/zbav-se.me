import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { tTransactionEntryLocation } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { TypeContainer } from "../TypeContainer";

export namespace Pending {
	export interface Props {
		transactionEntry: Pick<tTransactionEntryLocation, "direction">;
	}
}

export const Pending: FC<Pending.Props> = ({ transactionEntry }) => {
	return (
		<TypeContainer
			direction={transactionEntry.direction}
			ui={{
				flow: "vertical",
			}}
			className={"min-h-24"}
		>
			<SpinnerContainer />
		</TypeContainer>
	);
};
