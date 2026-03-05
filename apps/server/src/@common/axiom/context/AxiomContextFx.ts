import { Context } from "effect";

export interface AxiomContext {
	token: string;
	dataset: string;
	traceId: string;
	root: string;
}

export class AxiomContextFx extends Context.Tag("AxiomContextFx")<AxiomContextFx, AxiomContext>() {
	//
}
