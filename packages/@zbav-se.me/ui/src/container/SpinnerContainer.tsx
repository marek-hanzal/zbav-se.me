import { SpinnerIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { FC } from "react";
import { PrimaryOverlay } from "../overlay/PrimaryOverlay";

export namespace SpinnerContainer {
	export interface Props extends Container.Props {
		disableOverlay?: boolean;
		statusProps?: Status.Props;
	}
}

export const SpinnerContainer: FC<SpinnerContainer.Props> = ({
	disableOverlay = false,
	statusProps,
	...props
}) => {
	return (
		<Container
			layout={"vertical-centered"}
			items={"center"}
			border={"unset"}
			shadow={"unset"}
			{...props}
		>
			{disableOverlay ? null : <PrimaryOverlay />}

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
