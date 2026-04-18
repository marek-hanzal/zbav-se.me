import { type FC, useState } from "react";
import { Icon, PlusIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import { ListItem } from "~/common/list-item/ListItem";
import { CreateSheet } from "./CreateSheet";

export namespace CreateButton {
	export interface Props extends ListItem.PropsEx {
		//
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ className, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<ListItem
				data-ui={"CreateButton[Button]"}
				data-action={"create new feed"}
				hero={
					<Icon
						icon={PlusIcon}
						data-ui-text="2xl"
						data-ui-color="lead"
						data-ui-opacity="6"
					/>
				}
				title={
					<Tx
						label={"Create new feed (title)"}
						data-ui-font="bold"
					/>
				}
				bottom={
					<Tx
						label={"Create new feed (hint)"}
						data-ui-text="sm"
						data-ui-opacity="6"
					/>
				}
				onClick={() => setIsOpen(true)}
				{...props}
			/>

			<CreateSheet
				state={{
					value: isOpen,
					set: setIsOpen,
				}}
			/>
		</>
	);
};
