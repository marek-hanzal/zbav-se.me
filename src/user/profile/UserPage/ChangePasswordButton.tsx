import { type FC, useState } from "react";
import { Button } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import { ChangePasswordSheet } from "./ChangePasswordSheet";

export namespace ChangePasswordButton {
	export interface Props extends Button.Props {
		//
	}
}

export const ChangePasswordButton: FC<ChangePasswordButton.Props> = ({ ...props }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				iconEnabled={"icon-[solar--key-minimalistic-square-linear]"}
                iconProps={{
                    "data-ui-text": 'xl',
                }}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-shadow={false}
				data-ui-border={undefined}
				data-ui-size="default"
				data-ui-width="full"
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			>
				<Tx label={"Change password (label)"} />
			</Button>

			<ChangePasswordSheet
				state={{
					value: isOpen,
					set: setIsOpen,
				}}
			/>
		</>
	);
};
