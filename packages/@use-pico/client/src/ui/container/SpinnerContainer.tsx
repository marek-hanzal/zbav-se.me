import { Icon, type IconCls, SpinnerIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { Cls } from "@use-pico/cls";
import type { FC } from "react";

export namespace SpinnerContainer {
	export interface Props extends Container.Props {
		statusProps?: Status.Props;
		iconProps?: Icon.Props;
		size?: Cls.VariantOf<IconCls, "size">;
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
			items={"center"}
			tone={"unset"}
			theme={"unset"}
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
