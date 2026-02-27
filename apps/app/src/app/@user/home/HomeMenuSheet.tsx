import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { translator } from "@use-pico/common/translator";
import { CloseButton } from "@zbav-se.me/ui/button";
import type { FC } from "react";
import { HomeMenu } from "./HomeMenu/HomeMenu";

export namespace HomeMenuSheet {
	export interface Props extends BottomSheet.Props {
		//
	}
}

/**
 * Wraps home menu content inside a sheet-style container with app-specific defaults.
 * Use it for secondary flows that should open in an overlay instead of a full page.
 *
 * @see apps/app/src/app/@user/home/page/HomePage.tsx
 */
export const HomeMenuSheet: FC<HomeMenuSheet.Props> = (props) => {
	return (
		<BottomSheet
			data-ui={"HomeMenuSheet[BottomSheet]"}
			detent={"default"}
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
