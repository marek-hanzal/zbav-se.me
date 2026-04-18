import type { FC } from "react";
import { EditIcon, Icon } from "@/lib/client/icon";

export namespace EditAction {
	export interface Props extends Icon.PropsEx {
		//
	}
}

export const EditAction: FC<EditAction.Props> = ({ ...props }) => {
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
