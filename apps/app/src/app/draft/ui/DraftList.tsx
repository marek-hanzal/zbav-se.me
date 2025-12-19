import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace DraftList {
	export interface Props extends Container.Props {
		//
	}
}

export const DraftList: FC<DraftList.Props> = ({ ui, ...props }) => {
	return (
		<Container
			data-root="DraftList[Container]"
			ui={{
				...ui,
			}}
			{...props}
		>
			draft-list
		</Container>
	);
};
