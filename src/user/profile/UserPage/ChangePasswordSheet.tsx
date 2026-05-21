import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { useTranslator } from "@/lib/client/translation";
import type { StateType } from "@/lib/client/type";
import { CloseButton } from "~/common/ui/button";

export namespace ChangePasswordSheet {
	export interface Props extends BottomSheet.PropsEx {
		state: StateType.Simple<boolean>;
	}
}

export const ChangePasswordSheet: FC<ChangePasswordSheet.Props> = ({ state, ...props }) => {
	const translator = useTranslator();

	return (
		<BottomSheet
			isOpen={state.value}
			onClose={() => {
				state.set(false);
			}}
			header={({ close }) => ({
				title: translator.text("Change password (title)"),
				right: <CloseButton onClick={close} />,
			})}
			{...props}
		>
			foo
		</BottomSheet>
	);
};
