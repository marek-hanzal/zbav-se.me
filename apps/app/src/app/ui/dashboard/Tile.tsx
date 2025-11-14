import { Button } from "@use-pico/client/ui/button";
import type { FC } from "react";

export namespace Tile {
	export interface Props extends Button.Props {
		//
	}
}

export const Tile: FC<Tile.Props> = ({ tweak, ...props }) => {
	return (
		<Button
			tone={"primary"}
			theme={"light"}
			size={"xl"}
			iconPosition={"right"}
			tweak={[
				{
					slot: {
						root: {
							class: [
								"justify-between",
							],
						},
					},
				},
				tweak,
			]}
			full
			{...props}
		/>
	);
};
