import type { FC } from "react";
import { Button } from "../button/Button";

export namespace SubmitButton {
	export interface Props extends Button.Props {
		//
	}
}

export const SubmitButton: FC<SubmitButton.Props> = (props) => {
	return (
		<Button
			type={"submit"}
			data-ui-tone="primary"
			data-ui-theme="light"
			data-ui-size="default"
			data-ui-text="lg"
			data-ui-justify="center"
			data-ui-width="full"
			iconProps={{
				"data-ui-text": "xl",
			}}
			{...props}
		/>
	);
};
