import { EditIcon, Icon } from "@use-pico/client/icon";
import type { FC } from "react";

export namespace EditAction {
	export interface Props extends Icon.PropsEx {
		//
	}
}

export const EditAction: FC<EditAction.Props> = (props) => {
	return (
		<Icon
			icon={EditIcon}
			{...props}
		/>
	);
};
