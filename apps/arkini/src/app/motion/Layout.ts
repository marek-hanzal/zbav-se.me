import type { Cell } from "~/app/motion/Cell";
import type { Position } from "~/app/motion/Position";
import type { Size } from "~/app/motion/Size";

export interface Layout {
	width: number;
	height: number;
	//
	cellToPx(cell: Cell): Position;
	cellSize: Size;
	//
	pxToCell(point: Position): Cell;
	//
	deltaPx(from: Position, to: Position): Position;
}
