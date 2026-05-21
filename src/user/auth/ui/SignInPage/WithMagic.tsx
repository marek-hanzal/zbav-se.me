import type { FC } from "react";
import { Container } from "@/lib/client/container";

export namespace WithMagic {
	export interface Props extends Container.Props {
		//
	}
}

export const WithMagic: FC<WithMagic.Props> = ({ ...props }) => {
	return (
		<Container
			data-ui={"WithMagic"}
			data-ui-layout="vertical-centered"
			data-ui-height="full"
			data-ui-width="full"
			{...props}
		>
			pica
		</Container>
	);
};
