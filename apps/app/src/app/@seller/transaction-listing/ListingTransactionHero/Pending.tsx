import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace Pending {
	export interface Props extends Container.Props {
		//
	}
}

export const Pending: FC<Pending.Props> = ({ ui, ...props }) => {
	return (
		<Container
			data-ui="ListingTransactionHero[Pending]"
			className={"h-42"}
			ui={{
				position: "relative",
				width: "full",
				tone: "neutral",
				theme: "light",
				background: "default",
				opacity: "4",
				...ui,
			}}
			{...props}
		/>
	);
};
