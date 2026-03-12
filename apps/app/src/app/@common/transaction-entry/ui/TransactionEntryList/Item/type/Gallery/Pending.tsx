import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { tTransactionEntryGallery } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { TypeContainer } from "../TypeContainer";

export namespace Pending {
	export interface Props {
		transactionEntry: Pick<tTransactionEntryGallery, "direction">;
	}
}

export const Pending: FC<Pending.Props> = ({ transactionEntry }) => {
	return (
		<TypeContainer
			direction={transactionEntry.direction}
			ui={{
				tone: "neutral",
				theme: "light",
				background: "default",
			}}
			className={"h-48"}
		>
			<SpinnerContainer />
		</TypeContainer>
	);
};
