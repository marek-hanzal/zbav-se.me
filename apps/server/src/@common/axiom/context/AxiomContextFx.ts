import { Context } from "effect";

export interface AxiomContext {
	token: string;
	dataset: string;
}

export class AxiomContextFx extends Context.Tag("AxiomContextFx")<AxiomContextFx, AxiomContext>() {
	//
}
