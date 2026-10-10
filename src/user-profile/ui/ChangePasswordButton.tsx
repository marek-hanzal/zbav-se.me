import { type FC, useState } from "react";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import { ChangePasswordSheet } from "~/user-profile/ui/ChangePasswordSheet";

export namespace ChangePasswordButton {
	export interface Props extends Button.Props {
		//
	}
}

export const ChangePasswordButton: FC<ChangePasswordButton.Props> = ({ ...props }) => {
	const [isOpen, setIsOpenFn] = useState(false);

	return (
		<>
			<Button
				iconEnabled={"icon-[solar--key-minimalistic-square-linear]"}
				iconProps={{
					"data-ui-text": "xl",
				}}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-shadow={false}
				data-ui-border={undefined}
				data-ui-size="default"
				data-ui-width="full"
				onClick={() => {
					setIsOpenFn(true);
				}}
				{...props}
			>
				<Tx label={"Change password (label)"} />
			</Button>

			<ChangePasswordSheet
				state={{
					value: isOpen,
					setFn: setIsOpenFn,
				}}
			/>
		</>
	);
};
