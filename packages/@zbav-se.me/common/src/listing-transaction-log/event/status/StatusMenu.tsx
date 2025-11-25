import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import type { FC } from "react";

export namespace StatusMenu {
	export interface Props extends BottomSheet.PropsEx {
		//
	}
}

export const StatusMenu: FC<StatusMenu.Props> = ({ ...props }) => {
	return (
		<BottomSheet
			disableDismiss
			isOpen
			onClose={() => {
				//
			}}
			snapPoints={[
				0,
				122,
				1,
			]}
			initialSnap={1}
			detent={"content"}
			{...props}
		>
			<Container
				layout={"vertical-flex"}
				gap={"md"}
			>
				<Button
					size={"xl"}
					full
				>
					Nejaky cudl
				</Button>

				<Button
					size={"xl"}
					full
				>
					Dalsi cudl
				</Button>

				<Button
					size={"xl"}
					full
				>
					Hromada cudlu
				</Button>
			</Container>
		</BottomSheet>
	);
};
