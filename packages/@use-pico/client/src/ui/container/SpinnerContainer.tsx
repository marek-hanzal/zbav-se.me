import { Icon, SpinnerIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { FC } from "react";
import type { asIcon } from "../../icon/asIcon";

export namespace SpinnerContainer {
	export interface Props extends Container.Props {
		statusProps?: Status.Props;
		iconProps?: Icon.Props;
		size?: asIcon.Size;
		type?: "icon" | "status";
	}
}

export const SpinnerContainer: FC<SpinnerContainer.Props> = ({
	statusProps,
	iconProps,
	size = "2xl",
	type = "status",
	...props
}) => {
	return (
		<Container
			layout={"vertical-centered"}
			height={"full"}
			{...props}
		>
			{type === "status" ? (
				<Status
					icon={SpinnerIcon}
					iconProps={{
						size,
						...iconProps,
					}}
					{...statusProps}
				/>
			) : null}

			{type === "icon" ? (
				<Icon
					icon={SpinnerIcon}
					size={size}
					{...iconProps}
				/>
			) : null}
		</Container>
	);
};
