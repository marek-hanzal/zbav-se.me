import { SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace TransactionListingItemPending {
	export interface Props extends SpinnerContainer.Props {
		//
	}
}

export const TransactionListingItemPending: FC<TransactionListingItemPending.Props> = (props) => {
	return (
		<SpinnerContainer
			type={"icon"}
			ui={{
				tone: "neutral",
				theme: "light",
				background: "default",
				border: true,
				width: "full",
				height: "full",
				shadow: true,
				round: "lg",
			}}
			className={[
				"h-42 md:h-92",
			]}
			{...props}
		/>
	);
};
