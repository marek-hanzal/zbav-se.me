import { Icon, PlusIcon } from "@use-pico/client/icon";
import { Tx } from "@use-pico/client/ui/tx";
import { type FC, useState } from "react";
import { ListItem } from "~/app/@common/list-item/ListItem";
import { CreateSheet } from "./CreateSheet";

export namespace CreateButton {
	export interface Props extends ListItem.PropsEx {
		//
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ ui, className, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<ListItem
				data-ui={"CreateButton[Button]"}
				data-action={"create new feed"}
				hero={
					<Icon
						icon={PlusIcon}
						ui={{
							text: "2xl",
							color: "lead",
							opacity: "6",
						}}
					/>
				}
				title={
					<Tx
						label={"Create new feed (title)"}
						ui={{
							font: "bold",
						}}
					/>
				}
				bottom={
					<Tx
						label={"Create new feed (hint)"}
						ui={{
							text: "sm",
							opacity: "6",
						}}
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
