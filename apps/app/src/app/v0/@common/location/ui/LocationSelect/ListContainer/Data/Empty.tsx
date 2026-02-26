import { Badge } from "@use-pico/client/ui/badge";
import type { Container as ContainerUi } from "@use-pico/client/ui/container";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";

export namespace Empty {
	export interface Props extends Pick<ContainerUi.Props, "ui"> {
		//
	}
}

export const Empty: FC<Empty.Props> = ({ ui }) => {
	return (
		<Container
			data-ui="ListContainer[Container.empty]"
			ui={{
				layout: "vertical-centered",
				height: "full",
				...ui,
			}}
		>
			<Badge
				className="text-center mx-auto"
				ui={{
					size: "lg",
					tone: "danger",
					theme: "light",
				}}
			>
				<Tx label="Location not found (badge)" />
			</Badge>
		</Container>
	);
};
