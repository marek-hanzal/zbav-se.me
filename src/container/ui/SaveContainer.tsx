import type { FC, ReactNode } from "react";
import { uiCancelButtonFn, uiSaveButtonFn } from "~/application-ui/fn/ui.exports";
import { Tx } from "~/translation/ui/Tx";
import { ArrowLeftIcon } from "~/ui/constant/ArrowLeftIcon";
import { SaveIcon } from "~/ui/constant/SaveIcon";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";

export namespace SaveContainer {
	export interface Props extends Container.Props {
		onCancelFn(): void;
		onSaveFn(): void;
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
	onCancelFn,
	onSaveFn,
	loading,
	disabled,
	textCancel,
	textSave,
	cancelProps,
	saveProps,
	...props
}) => {
	return (
		<Container
			data-ui="SaveContainer"
			data-ui-flow="horizontal"
			data-ui-items="center"
			data-ui-justify="space-evenly"
			data-ui-gap="default"
			{...props}
		>
			<Button
				data-action={"cancel"}
				onClick={onCancelFn}
				disabled={loading}
				iconEnabled={ArrowLeftIcon}
				iconProps={{
					"data-ui-text": "xl",
				}}
				{...uiCancelButtonFn({})}
				{...cancelProps}
			>
				{textCancel ?? <Tx label="Back (label)" />}
			</Button>

			<Button
				data-action={"save"}
				onClick={onSaveFn}
				disabled={loading || disabled}
				loading={loading}
				iconEnabled={SaveIcon}
				iconProps={{
					"data-ui-text": "xl",
				}}
				{...uiSaveButtonFn({})}
				{...saveProps}
			>
				{textSave ?? <Tx label="Save (button)" />}
			</Button>
		</Container>
	);
};
