import type { FC } from "react";
import { Typo } from "@/lib/client/typo";

export namespace Value {
	export interface Props {
		value: string | undefined;
		placeholder: string;
	}
}

export const Value: FC<Value.Props> = ({ value, placeholder }) => {
	if (value) {
		return (
			<Typo
				data-ui={"Dial-Typo-value"}
				label={value}
				data-ui-text="xl"
				data-ui-font="bold"
				data-ui-display="block"
			/>
		);
	}

	return (
		<Typo
			data-ui={"Dial-Typo-value-placeholder"}
			label={placeholder}
			data-ui-text="xl"
			data-ui-font="bold"
			data-ui-display="block"
			data-ui-color="icon"
		/>
	);
};
