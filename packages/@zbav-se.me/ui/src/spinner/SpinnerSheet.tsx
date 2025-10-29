import { Container, SpinnerIcon, Status } from "@use-pico/client";
import type { FC } from "react";
import { PrimaryOverlay } from "../overlay/PrimaryOverlay";
import { Sheet } from "../sheet/Sheet";

export namespace SpinnerSheet {
	export interface Props extends Container.Props {
		disableOverlay?: boolean;
	}
}

export const SpinnerSheet: FC<SpinnerSheet.Props> = ({
	disableOverlay = false,
	...props
}) => {
	return (
		<Container
			square={"md"}
			tone={"secondary"}
			theme={"light"}
			position={"relative"}
			{...props}
		>
			{disableOverlay ? null : <PrimaryOverlay />}

			<Sheet>
				<Status
					icon={SpinnerIcon}
					iconProps={{
						size: "2xl",
					}}
				/>
			</Sheet>
		</Container>
	);
};
