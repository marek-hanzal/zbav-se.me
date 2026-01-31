import type { Action as CoolAction } from "~/app/motion/Action";
import type { Cell as CoolCell } from "~/app/motion/Cell";
import type { Layout as CoolLayout } from "~/app/motion/Layout";
import type { Plan as CoolPlan } from "~/app/motion/Plan";
import type { Position as CoolPosition } from "~/app/motion/Position";
import type { RenderNode as CoolRenderNode } from "~/app/motion/RenderNode";

export namespace Motion {
	export type Cell = CoolCell;
	export type Position = CoolPosition;
	//
	export type Action = CoolAction;
	export type Plan = CoolPlan;
	//
	export type RenderNode = CoolRenderNode;
	//
	export type Layout = CoolLayout;
}
