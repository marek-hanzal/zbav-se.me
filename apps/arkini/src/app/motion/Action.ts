import type { Cell } from "~/app/motion/Cell";

interface BaseAction {
	id: string;
}

export interface MoveAction extends BaseAction {
	type: "move";
	x: number;
	y: number;
	ms: number;
}

export interface ScaleUpAction extends BaseAction {
	type: "scale-up";
	scale: number;
	ms: number;
}

export interface ScaleDownAction extends BaseAction {
	type: "scale-down";
	scale: number;
	ms: number;
}

export interface PopAction extends BaseAction {
	type: "pop";
	ms: number;
	peak: number;
}

//

export interface DragStartAction extends BaseAction {
	type: "drag-start";
}

export interface DragEndAction extends BaseAction {
	type: "drag-end";
	target: Cell;
}

//

export interface NoopAction extends BaseAction {
	type: "noop";
}

//

export type Action = MoveAction | ScaleUpAction | ScaleDownAction | PopAction | NoopAction;
