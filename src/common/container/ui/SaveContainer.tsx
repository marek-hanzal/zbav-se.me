import type { FC, ReactNode } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ArrowLeftIcon, SaveIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import { uiCancelButton, uiSaveButton } from "~/common/ui/ui";

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
		cancelProps?: Button.Props;
		textSave?: ReactNode;
		saveProps?: Button.Props;
	}
}

/**
 * Groups cancel/save actions into a single reusable toolbar with loading and disabled-state handling.
 * Use it in editable forms where primary save and secondary cancel actions should stay visually consistent.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const SaveContainer: FC<SaveContainer.Props> = ({
	onCancel,
	onSave,
	loading,
	disabled,
	textCancel,
	textSave,
	ui,
	cancelProps,
	saveProps,
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
				data-action={"cancel"}
				onClick={onCancel}
				disabled={loading}
				iconEnabled={ArrowLeftIcon}
				iconProps={{
					"data-ui-text": "xl",
				}}
				{...uiCancelButton({
					className: [],
				})}
				{...cancelProps}
			>
				{textCancel ?? <Tx label="Back (label)" />}
			</Button>

			<Button
				data-action={"save"}
				onClick={onSave}
				disabled={loading || disabled}
				loading={loading}
				iconEnabled={SaveIcon}
				iconProps={{
					"data-ui-text": "xl",
				}}
				{...uiSaveButton({
					className: [],
				})}
				{...saveProps}
			>
				{textSave ?? <Tx label="Save (button)" />}
			</Button>
		</Container>
	);
};
