import { ArrowLeftIcon, SaveIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { uiCancelButton, uiSaveButton } from "@zbav-se.me/ui/ui";
import type { FC, ReactNode } from "react";

export namespace SaveContainer {
	export interface Props extends Container.Props {
		onCancel(): void;
		onSave(): void;
		loading: boolean;
		disabled: boolean;
		/**
		 * Already translated text to replace default Cancel label
		 */
		textCancel?: ReactNode;
		textSave?: ReactNode;
	}
}

/**
 * Groups cancel/save actions into a single reusable toolbar with loading and disabled-state handling.
 * Use it in editable forms where primary save and secondary cancel actions should stay visually consistent.
 *
 * @see apps/app/src/app/@seller-user/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const SaveContainer: FC<SaveContainer.Props> = ({
	onCancel,
	onSave,
	loading,
	disabled,
	textCancel,
	textSave,
	ui,
	...props
}) => {
	return (
		<Container
			data-ui="SaveContainer[Container]"
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
				iconEnabled={ArrowLeftIcon}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				{...uiCancelButton({
					className: [],
				})}
			>
				{textCancel ?? <Tx label="Cancel (button)" />}
			</Button>

			<Button
				onClick={onSave}
				disabled={loading || disabled}
				loading={loading}
				iconEnabled={SaveIcon}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				{...uiSaveButton({
					className: [],
				})}
			>
				{textSave ?? <Tx label="Save (button)" />}
			</Button>
		</Container>
	);
};
