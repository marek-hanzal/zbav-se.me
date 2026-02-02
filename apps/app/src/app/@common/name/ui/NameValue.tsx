import { LabelValue } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace NameValue {
	export interface Props extends LabelValue.PropsEx {
		name: string | null;
	}
}

export const NameValue: FC<NameValue.Props> = ({ name, ...props }) => {
	return (
		<LabelValue
			data-ui={"NameValue[LabelValue]"}
			textLabel={"Feed name (label)"}
			textValue={name}
			wrapperProps={{
				ui: name
					? {
							tone: "neutral",
							theme: "light",
						}
					: undefined,
			}}
			{...props}
		/>
	);
};
