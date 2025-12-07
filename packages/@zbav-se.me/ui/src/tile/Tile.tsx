import { Button } from "@use-pico/client/ui/button";
import type { FC } from "react";

export namespace Tile {
	export interface Props extends Button.Props {
		//
	}
}

export const Tile: FC<Tile.Props> = (props) => {
	return (
		<Button
			data-ui={"Tile-root"}
			tone={"primary"}
			theme={"light"}
			size={"xl"}
			menu
			{...props}
		/>
	);
};
