import { Container, SpinnerIcon, Status } from "@use-pico/client";
import type { FC } from "react";
import { PrimaryOverlay } from "../overlay/PrimaryOverlay";

export namespace SpinnerContainer {
	export interface Props extends Container.Props {
		disableOverlay?: boolean;
	}
}

export const SpinnerContainer: FC<SpinnerContainer.Props> = ({
	disableOverlay = false,
	...props
}) => {
	return (
		<Container
			square={"md"}
			tone={"secondary"}
			theme={"light"}
			position={"relative"}
			layout={"vertical-centered"}
			items={"center"}
			{...props}
		>
			{disableOverlay ? null : <PrimaryOverlay />}

			<Status
				icon={SpinnerIcon}
				iconProps={{
					size: "2xl",
				}}
			/>
		</Container>
	);
};
