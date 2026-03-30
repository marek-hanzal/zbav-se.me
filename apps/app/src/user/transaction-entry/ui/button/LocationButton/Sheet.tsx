import type { FC, PropsWithChildren } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import type { StateType } from "@use-pico/common/type";
import { CloseButton } from "~/common/ui/button";

export namespace Sheet {
	export interface Props extends PropsWithChildren {
		state: StateType.State<boolean>;
	}
}

export const Sheet: FC<Sheet.Props> = ({ state, children }) => {
	return (
		<BottomSheet
			isOpen={state.value}
			onClose={() => {
				state.set(false);
			}}
			detent={"default"}
			withHeader
			header={({ close }) => ({
				title: "Share location (title)",
				right: <CloseButton onClick={close} />,
			})}
		>
			{children}
		</BottomSheet>
	);
};
