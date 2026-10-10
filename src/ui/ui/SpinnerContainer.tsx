import type { FC } from "react";
import { SpinnerIcon } from "~/ui/constant/SpinnerIcon";
import type { Ui } from "~/ui/type/Ui";
import { Container } from "~/ui/ui/Container";
import { Icon } from "~/ui/ui/Icon";
import { Status } from "~/ui/ui/Status";

export namespace SpinnerContainer {
	export interface Props extends Container.Props {
		statusProps?: Status.Props;
		iconProps?: Icon.PropsEx;
		size?: Ui.Text;
		type?: "icon" | "status";
	}
}

export const SpinnerContainer: FC<SpinnerContainer.Props> = ({
	statusProps,
	iconProps,
	size = "4xl",
	type = "status",
	//
	...props
}) => {
	return (
		<Container
			data-ui-tone="brand"
			data-ui-theme="light"
			data-ui-layout="vertical-centered"
			data-ui-height="full"
			data-ui-text={size}
			data-ui-color="lead"
			{...props}
		>
			{type === "status" ? (
				<Status
					icon={SpinnerIcon}
					iconProps={{
						...iconProps,
					}}
					{...statusProps}
				/>
			) : null}

			{type === "icon" ? (
				<Icon
					icon={SpinnerIcon}
					{...iconProps}
				/>
			) : null}
		</Container>
	);
};
