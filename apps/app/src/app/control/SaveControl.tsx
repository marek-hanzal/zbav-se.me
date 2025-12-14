import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { uiCancelButton, uiSaveButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace SaveControl {
	export interface Props extends Container.Props {
		onCancel(): void;
		onSave(): void;
	}
}

export const SaveControl: FC<SaveControl.Props> = ({ onCancel, onSave, ui, ...props }) => {
	return (
		<Container
			ui={{
				flow: "horizontal",
				items: "center",
				justify: "space-evenly",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<Button
				onClick={onCancel}
				{...uiCancelButton({
					className: [],
				})}
			>
				<Tx label="Cancel (button)" />
			</Button>

			<Button
				onClick={onSave}
				{...uiSaveButton({
					className: [],
				})}
			>
				<Tx label="Save (button)" />
			</Button>
		</Container>
	);
};
