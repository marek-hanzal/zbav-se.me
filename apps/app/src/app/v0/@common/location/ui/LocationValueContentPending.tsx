import { LabelValue, SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace LocationValueContentPending {
	export interface Props extends LabelValue.PropsEx {
		//
	}
}

export const LocationValueContentPending: FC<LocationValueContentPending.Props> = ({
	...props
}) => {
	return (
		<LabelValue
			{...props}
			textValue={
				<SpinnerContainer
					type="icon"
					size="md"
				/>
			}
		/>
	);
};
