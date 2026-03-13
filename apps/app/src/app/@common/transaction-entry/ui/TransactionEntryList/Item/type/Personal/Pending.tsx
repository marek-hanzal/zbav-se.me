import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { tTransactionEntryPersonal } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { TypeContainer } from "../TypeContainer";

export namespace Pending {
	export interface Props {
		transactionEntry: Pick<tTransactionEntryPersonal, "direction">;
	}
}

export const Pending: FC<Pending.Props> = ({ transactionEntry }) => {
	return (
		<TypeContainer
			direction={transactionEntry.direction}
			ui={{
				flow: "vertical",
			}}
			className={"min-h-44"}
		>
			<SpinnerContainer />
		</TypeContainer>
	);
};
