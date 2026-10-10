import type { FC } from "react";
import { Container } from "~/ui/ui/Container";

export namespace FieldContainer {
	export interface Props extends Container.Props {
		//
	}
}

export const FieldContainer: FC<FieldContainer.Props> = (props) => {
	return (
		<Container
			data-ui={"FieldContainer"}
			{...props}
		/>
	);
};
