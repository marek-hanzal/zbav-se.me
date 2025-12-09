import { Icon, SpinnerIcon } from "@use-pico/client/icon";
import type { FC } from "react";
import type { uiIcon } from "../../icon/uiIcon";
import { Status } from "../status/Status";
import { Container } from "./Container";

export namespace SpinnerContainer {
	export interface Props extends Container.Props {
		statusProps?: Status.Props;
		iconProps?: Icon.Props;
		size?: uiIcon.Size;
		type?: "icon" | "status";
	}
}

export const SpinnerContainer: FC<SpinnerContainer.Props> = ({
	statusProps,
	iconProps,
	size = "2xl",
	type = "status",
	//
	ui,
	//
	...props
}) => {
	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
				...ui,
			}}
			{...props}
		>
			{type === "status" ? (
				<Status
					icon={SpinnerIcon}
					iconProps={{
						ui: {
							size,
						},
						...iconProps,
					}}
					{...statusProps}
				/>
			) : null}

			{type === "icon" ? (
				<Icon
					icon={SpinnerIcon}
					ui={{
						size,
					}}
					{...iconProps}
				/>
			) : null}
		</Container>
	);
};
