import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace TransactionItemPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const TransactionItemPending: FC<TransactionItemPending.Props> = (props) => {
	return (
		<SpinnerContainer
			type={"icon"}
			ui={{
				tone: "neutral",
				theme: "light",
				background: "default",
				border: true,
				shadow: true,
				round: "default",
			}}
			className={[
				"h-48 md:h-92",
			]}
			{...props}
		/>
	);
};
