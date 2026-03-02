import { LabelValue, SpinnerContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace Pending {
	export interface Props extends LabelValue.PropsEx {
		//
	}
}

export const Pending: FC<Pending.Props> = ({ ...props }) => {
	return (
		<LabelValue
			textValue={
				<SpinnerContainer
					type="icon"
					size="md"
				/>
			}
			{...props}
		/>
	);
};
