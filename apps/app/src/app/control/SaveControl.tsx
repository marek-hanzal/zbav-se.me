import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { uiCancelButton, uiSaveButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace SaveControl {
	export interface Props extends Container.Props {
		onCancel(): void;
		onSave(): void;
		loading: boolean;
	}
}

export const SaveControl: FC<SaveControl.Props> = ({ onCancel, onSave, loading, ui, ...props }) => {
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
				disabled={loading}
				{...uiCancelButton({
					className: [],
				})}
			>
				<Tx label="Cancel (button)" />
			</Button>

			<Button
				onClick={onSave}
				disabled={loading}
				loading={loading}
				{...uiSaveButton({
					className: [],
				})}
			>
				<Tx label="Save (button)" />
			</Button>
		</Container>
	);
};
