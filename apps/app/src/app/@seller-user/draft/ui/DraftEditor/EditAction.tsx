import { EditIcon, Icon } from "@use-pico/client/icon";
import type { FC } from "react";

export namespace EditAction {
	export interface Props extends Icon.PropsEx {
		//
	}
}

export const EditAction: FC<EditAction.Props> = ({ ui, ...props }) => {
	return (
		<Icon
			icon={EditIcon}
			ui={{
				text: "xl",
				...ui,
			}}
			{...props}
		/>
	);
};
