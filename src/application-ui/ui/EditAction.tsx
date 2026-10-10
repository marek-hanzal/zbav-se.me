import type { FC } from "react";
import { EditIcon } from "~/ui/constant/EditIcon";
import { Icon } from "~/ui/ui/Icon";

export namespace EditAction {
	export interface Props extends Icon.PropsEx {
		//
	}
}

export const EditAction: FC<EditAction.Props> = ({ ...props }) => {
	return (
		<Icon
			icon={EditIcon}
			data-ui-text="xl"
			{...props}
		/>
	);
};
