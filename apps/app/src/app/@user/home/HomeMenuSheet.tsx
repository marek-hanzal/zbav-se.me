import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { translator } from "@use-pico/common/translator";
import { CloseButton } from "@zbav-se.me/ui/button";
import type { FC } from "react";
import { HomeMenu } from "~/app/@user/home/HomeMenu";

export namespace HomeMenuSheet {
	export interface Props extends BottomSheet.Props {
		//
	}
}

export const HomeMenuSheet: FC<HomeMenuSheet.Props> = (props) => {
	return (
		<BottomSheet
			data-ui={"HomeMenuSheet[BottomSheet]"}
			detent={"full"}
			header={({ close }) => ({
				title: translator.text("zbav-se.me"),
				right: (
					<CloseButton
						onClick={close}
						ui={{
							background: undefined,
							shadow: false,
							border: false,
						}}
					/>
				),
			})}
			contentProps={{
				disableScroll: true,
			}}
			{...props}
		>
			<HomeMenu />
		</BottomSheet>
	);
};
