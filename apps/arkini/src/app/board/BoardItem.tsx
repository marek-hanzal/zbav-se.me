import { Container } from "@use-pico/client/ui/container";
import type { tItem } from "@zbav-se.me/sdk/api/arkini";
import type { FC } from "react";

export namespace BoardItem {
	export interface Props {
		item: tItem;
		cols: number;
		rows: number;
	}
}

export const BoardItem: FC<BoardItem.Props> = ({ item, cols, rows }) => {
	return (
		<Container
			data-ui={"Board[Item]"}
			className={[
				"absolute",
				"pointer-events-auto select-none",
			]}
			style={{
				// item zabere 1 cell
				width: `calc(100% / ${cols})`,
				height: `calc(100% / ${rows})`,

				// umístění do cell (top-left)
				left: `calc((100% / ${cols}) * ${item.x})`,
				top: `calc((100% / ${rows}) * ${item.y})`,
			}}
		>
			<div className="h-full w-full p-1">
				<div className="h-full w-full rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-white/80 text-sm">
					{item.x},{item.y}
				</div>
			</div>
		</Container>
	);
};
