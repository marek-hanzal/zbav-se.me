import type { FC } from "react";
import { FieldContainer } from "~/user-field/ui/FieldContainer";

export namespace FieldText {
	export interface Props extends FieldContainer.Props {
		//
	}
}

export const FieldText: FC<FieldText.Props> = (props) => {
	return (
		<FieldContainer
			data-ui={"FieldText"}
			{...props}
		/>
	);
};
