import { SpinnerIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { FC } from "react";

export namespace SpinnerContainer {
	export interface Props extends Container.Props {
		statusProps?: Status.Props;
	}
}

export const SpinnerContainer: FC<SpinnerContainer.Props> = ({ statusProps, ...props }) => {
	return (
		<Container
			layout={"vertical-centered"}
			items={"center"}
			border={"unset"}
			shadow={"unset"}
			{...props}
		>
			<Status
				icon={SpinnerIcon}
				iconProps={{
					size: "2xl",
				}}
				{...statusProps}
			/>
		</Container>
	);
};
