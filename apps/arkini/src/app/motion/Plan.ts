import type { Action } from "~/app/motion/Action";

type BasePlan = {};

export interface ParalelPlan extends BasePlan {
	type: "paralel";
	children: Plan[];
}

export interface SequencePlan extends BasePlan {
	type: "sequence";
	children: Plan[];
}

export interface ActionPlan extends BasePlan {
	type: "action";
	action: Action;
}

export type Plan = ParalelPlan | SequencePlan | ActionPlan;
