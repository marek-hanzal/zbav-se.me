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
			tweak={[
				tweak,
				{
					slot: {
						root: {
							class: [
								"py-10",
							],
						},
					},
				},
			]}
			{...props}
		/>
	);
};
